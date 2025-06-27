from fastapi import APIRouter,Query
from typing import List
from fastapi import APIRouter,HTTPException,UploadFile,Request,File, Body
import os
import shutil
from lib.extract_text import get_text_chunks
import uuid
from models import Session, User
from lib.constants import BACKEND_URL
from models.pdf_schema import PDF
from lib.vectors import store_in_vec_db
from bson import ObjectId
from beanie.operators import And
from models.pdf_schema import FileDelSchema
from lib.vectors import delete_from_vector
from models.session_schema import SessionRes

router=APIRouter(prefix='/session')
UPLOAD_DIR = "public"

os.makedirs(UPLOAD_DIR, exist_ok=True)

def store_file_data_vectors(files:List[File]):
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
    return file_data

@router.post('/create-session', summary='Create session and upload Files')
async def create_session(
    request: Request,
    files: List[UploadFile],
):
    user_data = request.state.user

    user = await User.find_one(User.email == user_data["email"])
    file_data = store_file_data_vectors(files=files)
    session_name = files[0].filename.rsplit('.', 1)[0]

    session = Session(
        name=session_name,
        pdfs=file_data,
        owner=user
    )
    new_session=await session.insert()

    new_session =await Session.find_one(Session.id==ObjectId(new_session.id)).project(projection_model=SessionRes)
    return new_session

@router.post('/add-file')
async def add_files_to_existing_session(
    request: Request,
    files: List[UploadFile],
    session_id:str=Query(...)
):
    user_data = request.state.user

    user = await User.find_one(User.email == user_data["email"])

    session= await Session.find_one(And (Session.id==ObjectId(session_id), Session.owner.id==ObjectId(user.id)))

    if session==None:
        raise HTTPException(status_code=404, detail="Session not exists")

    new_pdfs = store_file_data_vectors(files=files)

    session.pdfs.extend(new_pdfs)
    await session.save()

    return {
        "message": "New pdfs uploaded",
        "session_id": str(session.id)
    }

@router.delete("/delete-files")
async def delete_files_from_session(request:Request,session_id:str=Query(...),payload:FileDelSchema=Body(...)):
    user_data = request.state.user

    user = await User.find_one(User.email == user_data["email"])

    session= await Session.find_one(And (Session.id==ObjectId(session_id), Session.owner.id==ObjectId(user.id)))
    kept_pdfs=[]
    pdf_ids = payload.pdfs
    if session==None:
        raise HTTPException(status_code=404, detail="Session not exists")   
    
    for pdf in session.pdfs:
        if pdf.id in pdf_ids:
            delete_from_vector(pdfid=pdf.id)
        else:
            kept_pdfs.append(pdf)
    session.pdfs = kept_pdfs
    await session.save()

    return {
        "message": f"Deleted PDF(s) from session",
        "remaining_pdfs": [pdf.name for pdf in session.pdfs]
    }

@router.delete("/")
async def delete_session(request:Request,session_id:str=Query(...)):
    user_data = request.state.user
    user = await User.find_one(User.email == user_data["email"])
    session = await Session.find_one(
        And(
            Session.id == ObjectId(session_id),
            Session.owner.id == ObjectId(user.id)
        )
    )
    
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    
    await session.delete()
    
    return {
        "message": f"Session deleted with id {session_id}"
    }