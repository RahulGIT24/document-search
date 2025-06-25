from pydantic import BaseModel

class PDF(BaseModel):
    name:str
    url:str
    id:str