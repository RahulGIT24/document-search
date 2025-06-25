from fastapi import APIRouter,HTTPException,UploadFile,Request,File,Query,Body
from typing import List, Optional
import os
import shutil
from lib.extract_text import get_text_chunks
import uuid
from models import Session, User
from lib.constants import BACKEND_URL
from beanie.operators import And
from models.pdf_schema import PDF
from models.chat_schema import Chat as ChatSchema , ChatRes
from lib.vectors import store_in_vec_db
from lib.similarity_search import perform_similarity_search
from bson import ObjectId
from models import Chat

router = APIRouter(prefix='/chat')
UPLOAD_DIR = "public"

# Ensure the directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post('/create-session', summary='Create session and upload PDFs')
async def start_chat(
    request: Request,
    files: Optional[List[UploadFile]] = File(None),
):
    user_data = request.state.user  # Middleware should set this
    if not files:
        raise HTTPException(status_code=400, detail="Please provide at least 1 PDF")

    if len(files) > 4:
        raise HTTPException(status_code=400, detail="Only up to 4 PDFs are allowed")

    for file in files:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail=f"{file.filename} is not a PDF")

    file_data = []
    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, 'wb') as buffer:
            shutil.copyfileobj(file.file, buffer)

        pdf_id=str(uuid.uuid4())
        chunks=get_text_chunks(f'public/{file.filename}')
        file_data.append(PDF(
            name=file.filename,
            url=f"{BACKEND_URL}/public/{file.filename}",
            id=pdf_id
        ))

        if(store_in_vec_db(chunks=chunks,pdf_id=pdf_id)) ==  False:
            raise HTTPException(status_code=400, detail="Error storing in vector db")

    session_name = files[0].filename.rsplit('.', 1)[0]

    user = await User.find_one(User.email == user_data["email"])

    session = Session(
        name=session_name,
        pdfs=file_data,
        owner=user
    )
    await session.insert()

    return {
        "message": "Session created and PDFs uploaded",
        "session_id": str(session.id)
    }

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