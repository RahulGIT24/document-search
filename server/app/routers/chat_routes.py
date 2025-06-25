from fastapi import APIRouter,HTTPException,Request,Query,Body
from models import Session, User
from beanie.operators import And
from models.chat_schema import Chat as ChatSchema , ChatRes
from lib.similarity_search import perform_similarity_search
from bson import ObjectId
from models import Chat

router = APIRouter(prefix='/chat')

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

        chat = Chat(content=content,role='user',session=session)
        await chat.save()
        res=perform_similarity_search(pdfids=pdf_ids,content=content)

        if res==False:
            chat = Chat(content='Error while generating response',role='ai',session=session,error=True)
        else:
            chat = Chat(content=res,role='ai',session=session)
        
        await chat.save()

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

    chats = await Chat.find(
        Chat.session.id == ObjectId(session.id)
    ).project(projection_model=ChatRes).sort("created_at").to_list()

    if not chats:
        raise HTTPException(status_code=404, detail="No chats found for this session.")
    return chats