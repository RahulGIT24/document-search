from beanie import Document,Link
from typing import Optional
from datetime import datetime
from models import Session

class Chat(Document):
    content:Optional[str]=None
    role:str
    error:Optional[bool]=False
    session:Link[Session]
    created_at:datetime = datetime.utcnow()

    class settings:
        name='chats'