from fastapi import FastAPI
import uvicorn
from database.db import init_db
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from middleware.auth import JWTAuthMiddleware
from fastapi.staticfiles import StaticFiles
import lib.qdrant 
from lib.exempted_paths import exempt_paths

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

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
async def main():
    return {"message": "Hello World"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=9001, reload=True)
