from pydantic import BaseModel,EmailStr

class RegisterUserRequest(BaseModel):
    name:str
    email:EmailStr
    password:str

class LoginUserRequest(BaseModel):
    email:EmailStr
    password:str

class ForgotPassword(BaseModel):
    email:EmailStr

class ResetPassword(BaseModel):
    password:str