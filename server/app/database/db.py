from lib.constants import DB_NAME,MONGODB_URL
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from models import Chat,Session,User

async def init_db():
    client = AsyncIOMotorClient(MONGODB_URL)
    await init_beanie(database=client[DB_NAME],document_models=[User,Chat,Session])