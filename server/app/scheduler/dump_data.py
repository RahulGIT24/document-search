from models import Session,Chat
from sqlalchemy import select
from lib.redis import redis_client
from bson import ObjectId
from datetime import datetime
import json

async def dump_data_in_db():
    keys = redis_client.keys("session-*")
    for key in keys:
        session_id=key.replace("session-","")
        history = redis_client.hget(f"session-{session_id}","history")

        session = await Session.find_one(Session.id==ObjectId(session_id))

        if not session:
            redis_client.delete(f"session-{session_id}")

        if not history:
            continue

        chat_history = json.loads(history)

        for chat in chat_history:
            try:
                created_at = (
                        datetime.fromisoformat(chat["created_at"])
                        if isinstance(chat["created_at"], str)
                        else chat["created_at"]
                )
                if not chat.get("id"):
                    continue
                chat_obj = Chat(
                            content=chat["content"],
                            role=chat["role"],
                            session=session,
                            created_at=created_at,
                            error=chat.get("error", False),
                )
                await chat_obj.save()
                redis_client.delete(f"session-{session_id}")
                print("Chat inserted in db")
            except Exception as e:
                print(e)
                print('An exception occurred')

if __name__=="__main__":
    dump_data_in_db()
