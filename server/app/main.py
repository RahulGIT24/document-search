from fastapi import FastAPI
import uvicorn
from database.db import init_db
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from middleware.auth import JWTAuthMiddleware
from fastapi.staticfiles import StaticFiles
import lib.qdrant 
from lib.exempted_paths import exempt_paths
from lib.constants import PORT,HOST
from scheduler.dump_data import dump_data_in_db
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

scheduler = AsyncIOScheduler()
@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    scheduler.add_job(
        dump_data_in_db,
        IntervalTrigger(seconds=10),
        name="Dump chat data to DB"
    )
    scheduler.start()
    yield
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(JWTAuthMiddleware,exempt_paths=exempt_paths)

app.mount("/public", StaticFiles(directory='public'),name='public')

from routers import user_routes,chat_routes,session_routes
app.include_router(router=user_routes.router)
app.include_router(router=chat_routes.router)
app.include_router(router=session_routes.router)

@app.get("/health-check")
async def health():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=str(HOST), port=int(PORT), reload=True)