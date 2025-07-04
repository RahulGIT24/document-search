from models import Session,Chat
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
        updated_chats = []

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
                if chat.get("id") or chat.get('saved')==True:
                    updated_chats.append(chat)
                    continue
                chat_obj = Chat(
                            content=chat["content"],
                            role=chat["role"],
                            session=session,
                            created_at=created_at,
                            error=chat.get("error", False),
                )
                await chat_obj.save()
                chat["saved"] = True
                updated_chats.append(chat)
                print("Chat inserted in db")
            except Exception as e:
                print(e)
                print('An exception occurred')
            redis_client.hset(key, "history", json.dumps(updated_chats))

if __name__=="__main__":
    dump_data_in_db()
