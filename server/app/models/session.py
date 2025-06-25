from beanie import Document,Link
from datetime import datetime
from models import User
from models.pdf_schema import PDF
from typing import Optional,List

class Session(Document):
    name:str
    created_at:datetime = datetime.utcnow()
    pdfs:Optional[List[PDF]]=None
    owner:Link[User]

    class Settings:
        name='sessions'
