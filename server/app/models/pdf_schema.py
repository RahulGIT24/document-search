from pydantic import BaseModel
from typing import List

class PDF(BaseModel):
    name:str
    url:str
    id:str

class FileDelSchema(BaseModel):
    pdfs:List[str]