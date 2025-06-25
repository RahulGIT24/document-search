# register
# login
# verify account
# reset password

from fastapi import APIRouter,Body,HTTPException,Query,Request
from models.user_schema import RegisterUserRequest,LoginUserRequest,ForgotPassword,ResetPassword
import bcrypt
from beanie.operators import And
from jose import JWTError
import jwt
from lib.constants import JWT_SECRET,BACKEND_URL
from models import User
from datetime import datetime,timedelta
from lib.email_templates import get_verification_email_template,get_reset_password_mail
from lib.send_email import send_email
from fastapi.responses import JSONResponse
# from pydantic import EmailStr

router = APIRouter(prefix="/user")

@router.post("/register",description="Route to register user and send verification email")
async def register_user(payload:RegisterUserRequest=Body(...)):
    # try:
        name=payload.name
        email=payload.email
        password=payload.password
        if(len(password)<8):
            raise HTTPException(status_code=400,detail='Password length should contain minimum 8 characters')

        user=None
        user = await User.find_one(User.email==email)
        if user and user.verified==True:
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        payload = {
            'email':email,
            "exp": datetime.utcnow() + timedelta(hours=4)
        }

        verification_token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
        body = get_verification_email_template(name=name,backend_url=BACKEND_URL,token=verification_token)
        status = send_email(body=body,subject="Account Verification Required",to_email=email)
        if status:
            if user:
                user.password= hashed_password.decode("utf-8")
                user.name=name
                user.verificationToken=verification_token
                await user.save()
            else:
                user=User(password=hashed_password.decode("utf-8"),email=email,name=name,verificationToken=verification_token)
                await user.insert()
            return {'message':'User Registered. Please Verify Your Email'}
        else:
            raise HTTPException(status_code=400,detail='Error occured while sending verification email')
    # except Exception as e:
    #     print(e)
    #     raise HTTPException(status_code=500,detail='Internal Server Error')

@router.post('/login',description="Route to Login")
async def login_user(payload:LoginUserRequest=Body(...)):
    # try:
        email=payload.email
        password=payload.password
        if(len(password)<8):
            raise HTTPException(status_code=400,detail='Password length should contain minimum 8 characters')
        user=None
        user = await User.find_one(User.email==email)
        if user==None:
            raise HTTPException(status_code=404, detail="User not exists")
        if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')) == False:
            raise HTTPException(status_code=400,detail='Invalid Credentials')
        if user.verified==True:
            access_payload = {
                'email':email,
                "exp": datetime.utcnow() + timedelta(hours=9)
            }
            refresh_payload={
                'email':email,
                "exp": datetime.utcnow() + timedelta(hours=24)
            }
            access_token = jwt.encode(access_payload, JWT_SECRET, algorithm="HS256")
            refresh_token = jwt.encode(refresh_payload, JWT_SECRET, algorithm="HS256")
            user.refreshToken=refresh_token
            await user.save()
            response = JSONResponse(content={"message": "Logged In Successfully"})
            response.set_cookie(
                key='access_token',
                httponly=True,
                samesite='lax',
                value=access_token
            )
            response.set_cookie(
                key='refresh_token',
                httponly=True,
                samesite='lax',
                value=refresh_token
            )
            return response
        else:
            payload = {
                'email':email,
                "exp": datetime.utcnow() + timedelta(hours=4)
            }
            verification_token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
            body = get_verification_email_template(name=user.name,backend_url=BACKEND_URL,token=verification_token)
            status = send_email(body=body,subject="Account Verification Required",to_email=email)
            if status:
                user.verificationToken=verification_token
                await user.save()
                return {'message':'Account Not Verfied. Verfication Email Sent'}
            else:
                raise HTTPException(status_code=400,detail='Unable to send verification email')
    # except Exception as e:
    #     print(e)
    #     raise HTTPException(status_code=500,detail='Internal Server Error')

@router.get('/verify-token')
async def verify_token(token:str=Query(...)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        email=payload['email']
        user = await User.find_one(
        And (User.email == email, User.verificationToken == token)
    )
        if user==None:
            raise HTTPException(status_code=400, detail="Invalid Token")
        user.verified=True
        user.verificationToken=None
        await user.save()
        return {"message":'Account Verfied'}
    except jwt.ExpiredSignatureError:
        user.verificationToken=None
        await user.save()
        raise HTTPException(status_code=400, detail="Token has expired")
    except jwt.InvalidTokenError:
        user.verificationToken=None
        await user.save()
        raise HTTPException(status_code=400, detail="Invalid token")

@router.post('/forgot-password')
async def forgot_password(payload:ForgotPassword=Body(...)):
    # try:
        email=payload.email
        user = await User.find_one(User.email==email)
        if user==None:
            raise HTTPException(status_code=404, detail="User not exists")
        payload = {
            'email':email,
            "exp": datetime.utcnow() + timedelta(hours=4)
        }
        forgot_password_token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
        body = get_reset_password_mail(name=user.name,backend_url=BACKEND_URL,token=forgot_password_token)
        status = send_email(body=body,subject="Account Recovery",to_email=email)
        user.forgotPasswordToken=forgot_password_token
        await user.save()
        if status:
            return {'message':'Account Recovery Email Sent'}
        else:
            raise HTTPException(status_code=400, detail="Unable to send account recovery mail")
    # except Exception as e:
    #     print(e)
    #     raise HTTPException(status_code=500,detail='Internal Server Error')

@router.post('/reset-password')
async def reset_password(body:ResetPassword=Body(...),token:str=Query(...)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        email=payload['email']
        user = await User.find_one(
    And (User.email == email ,User.forgotPasswordToken == token)
)
        if user==None:
            raise HTTPException(status_code=400, detail="Invalid Token")
        password=body.password
        if(len(password)<8):
            raise HTTPException(status_code=400,detail='Password length should contain minimum 8 characters')
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        user.password=hashed_password.decode("utf-8")
        user.forgotPasswordToken=None
        await user.save()
        return {'message':'Password Reset Successfully'}
    except jwt.ExpiredSignatureError:
        user.forgotPasswordToken=None
        await user.save()
        raise HTTPException(status_code=400, detail="Token has expired")
    except jwt.InvalidTokenError:
        user.forgotPasswordToken=None
        await user.save()
        raise HTTPException(status_code=400, detail="Invalid token")

@router.get('/profile')
async def profile(request:Request):
    # try:
        jwt_payload = request.state.user
        email = jwt_payload.get("email")

        if not email:
            raise HTTPException(status_code=401, detail="Invalid token payload")

        user = await User.find_one(User.email == email)

        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "id": str(user.id),
            "name": user.name,
            "email": user.email,
            "verified": user.verified
        }

    # except Exception as e:
    #     print("Profile error:", e)
    #     raise HTTPException(status_code=500, detail="Internal server error")

@router.post('/refresh-tokens')
async def refresh_access_token(request:Request):
    try:
        token = request.cookies.get("refresh_token")
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        email=payload['email']
        user = await User.find_one(And (User.email == email,User.refreshToken==token))

        if user==None:
            response = JSONResponse(status_code=401,content={"detail": "Unautohrized"})
            response.delete_cookie(key="access_token")
            response.delete_cookie(key="refresh_token")
            return response

        access_payload = {
            'email':email,
            "exp": datetime.utcnow() + timedelta(hours=9)
        }
        refresh_payload={
            'email':email,
            "exp": datetime.utcnow() + timedelta(hours=24)
        }
        access_token = jwt.encode(access_payload, JWT_SECRET, algorithm="HS256")
        refresh_token = jwt.encode(refresh_payload, JWT_SECRET, algorithm="HS256")
        user.refreshToken=refresh_token
        await user.save()

        response = JSONResponse(content={"message": "Token Refreshed"})
        response.set_cookie(
            key='access_token',
            httponly=True,
            samesite='lax',
            value=access_token
            )
        response.set_cookie(
            key='refresh_token',
            httponly=True,
            samesite='lax',
            value=refresh_token
        )
        return response

    except JWTError:
        response = JSONResponse(status_code=401,content={"detail": "Unautohrized"})
        response.delete_cookie(key="access_token")
        response.delete_cookie(key="refresh_token")
        return response

@router.get("/logout")
async def logout():
    response = JSONResponse(content={"message": "Logged out successfully"})
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")
    return response