from beanie import Document,Link
from typing import Optional,List
from models import Session

class Chat(Document):
    content:Optional[str]=None
    role:str
    session:Link[Session]

    class settings:
        name='chats'