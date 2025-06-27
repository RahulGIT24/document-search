from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from bson import ObjectId
from pydantic import Field

class Chat(BaseModel):
    content:Optional[str]=None

class ChatRes(BaseModel):
    id: ObjectId = Field(..., alias="_id")
    content: str
    error: bool
    created_at: datetime
    role:str

    class Config:
        allow_population_by_field_name = True
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }
