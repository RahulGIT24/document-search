from beanie import Document
from pydantic import EmailStr
from typing import Optional
from datetime import datetime

class User(Document):
    name:str
    email:EmailStr
    password:str
    created_at:datetime = datetime.utcnow()
    verificationToken:Optional[str]=None
    forgotPasswordToken:Optional[str]=None
    refreshToken:Optional[str]=None
    verified:bool=False

    class Settings:
        name='users'
