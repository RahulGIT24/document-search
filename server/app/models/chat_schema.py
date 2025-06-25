from pydantic import BaseModel
from typing import Optional

class Chat(BaseModel):
    content:Optional[str]=None