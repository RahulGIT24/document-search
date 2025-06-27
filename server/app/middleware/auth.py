from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from fastapi.responses import JSONResponse
from jose import JWTError
import jwt
from lib.constants import JWT_SECRET

class JWTAuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, exempt_paths: list[str] = []):
        super().__init__(app)
        self.exempt_paths = exempt_paths

    async def dispatch(self, request: Request, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)
        path = request.url.path

        # Allow public paths
        if any(path.startswith(ep) for ep in self.exempt_paths):
            return await call_next(request)

        token = request.cookies.get("access_token")
        if not token:
            auth_header = request.headers.get("Authorization")
            if auth_header and auth_header.startswith("Bearer "):
                token = auth_header[7:]

        if not token:
            return JSONResponse(status_code=401, content={"detail": "Unauthorized"})

        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            request.state.user = payload
        except JWTError:
            return JSONResponse(status_code=401, content={"detail": "Invalid or expired token"})

        return await call_next(request)
