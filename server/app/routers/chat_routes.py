from fastapi import APIRouter,HTTPException,Request,Query,Body
from models import Session, User
from beanie.operators import And
from models.chat_schema import Chat as ChatSchema , ChatRes
from lib.similarity_search import perform_similarity_search
from bson import ObjectId
from datetime import datetime
from lib.redis import redis_client
import json
from models import Chat

router = APIRouter(prefix='/chat')
chat_history=[]

@router.post('/get-response')
async def get_response(request:Request,session_id=Query(...),payload:ChatSchema=Body(...)):
        content = payload.content

        if content==None:
            raise HTTPException(status_code=400,detail='Content should be provided')

        user=await User.find_one(User.email==request.state.user['email'])

        if user == None:
            raise HTTPException(status_code=404, detail="User not exists")
        
        session = await Session.find_one(
            And(Session.id == ObjectId(session_id),Session.owner.id==ObjectId(user.id))
        )

        if session==None:
            raise HTTPException(status_code=404, detail="Session not exists")
        pdf_ids=[]
        for pdf in session.pdfs:
            pdf_ids.append(pdf.id)

        if len(pdf_ids)==0:
            raise HTTPException(status_code=404, detail="No pdfs provided to answer")

        user_q = {
            "content":content,
            "role":'user',
            "session_id":session_id,
            "error":False,
            "created_at":datetime.utcnow().isoformat()
        }

        check_redis = redis_client.hget(f"session-{session_id}","history")
        res=perform_similarity_search(pdfids=pdf_ids,content=content,chat_history=[])

        llm_q = {
            "content": res if res else "Error while generating response",
            "role":'ai',
            "session_id":session_id,
            "error":not res,
            "created_at":datetime.utcnow().isoformat()
        }

        if check_redis:
            chat_data_arr = json.loads(check_redis) if check_redis else []
            chat_data_arr.append(user_q)
            chat_data_arr.append(llm_q)
            key = f"session-{session_id}"
            redis_client.hset(key,"history",json.dumps(chat_data_arr))
            redis_client.expire(key,300)

        return {'message':res}

@router.get('/get-chats')
async def get_chats(request: Request, session_id: str = Query(...)):
    user = await User.find_one(User.email == request.state.user['email'])
    if user is None:
        raise HTTPException(status_code=404, detail="User not exists")
    
    session = await Session.find_one(
        And(Session.id == ObjectId(session_id), Session.owner.id == ObjectId(user.id))
    )
    if session is None:
        raise HTTPException(status_code=404, detail="Session not exists")

    check_redis = redis_client.hget(f"session-{session_id}","history")

    if check_redis:
        return json.loads(check_redis)

    chats = []
    if check_redis==None:
        chats = await Chat.find(
            Chat.session.id == ObjectId(session.id)
        ).project(projection_model=ChatRes).sort("created_at").to_list()
        parsed_data = [chat.dict() for chat in chats]
        json_data = json.dumps(parsed_data, default=str, indent=2)
        key = f"session-{session_id}"
        redis_client.hset(key,"history",json_data)
        redis_client.expire(key,600)

    if not chats:
        raise HTTPException(status_code=404, detail="No chats found for this session.")
    return chats