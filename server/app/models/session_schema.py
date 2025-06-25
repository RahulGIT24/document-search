from pydantic import BaseModel,Field
from bson import ObjectId
from datetime import datetime
from typing import List
from models.pdf_schema import PDF

class SessionRes(BaseModel):
    id: ObjectId = Field(..., alias="_id")
    pdfs: List[PDF]
    created_at: datetime
    name:str

    class Config:
        allow_population_by_field_name = True
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {
            ObjectId: str
        }