import json

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.auth_service import AuthService
from src.auth.routers import oauth2_scheme
from src.auth.schemas import UpdateUserInfo
from src.database import get_db
from src.s3bucket.client import S3Client
from src.user.allowed_content import ALLOWED_CONTENT_TYPES
from src.whisper.database_service import DatabaseService
from src.whisper.file_service import FileService

router = APIRouter(prefix='/users', tags=['users'])


@router.post('/update-user-info')
async def update_user_info(info: UpdateUserInfo, token: str = Depends(oauth2_scheme),
                           db: AsyncSession = Depends(get_db)):
    database_service = DatabaseService(db)
    email = await database_service.get_email(token)
    user = await database_service.user_service.get_user_by_email(email)
    if user:
        if info.new_password:
            await database_service.auth_service.change_password(info.old_password, info.new_password, email)

        if info.name is not None:
            user.name = info.name

        if info.surname is not None:
            user.surname = info.surname

        if info.patronymic is not None:
            user.patronymic = info.patronymic

        db.add(user)
        await db.commit()
        await db.refresh(user)

        return {
            "status": "Successfully updated user information",
        }


@router.post('/upload-file')
async def upload_file(file: UploadFile = File(...), token: str = Depends(oauth2_scheme),
                      db: AsyncSession = Depends(get_db)):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail='Unsupported Media Type')

    file_service = FileService(file, db)
    await file_service.save_file()

    s3_client = S3Client()
    await s3_client.upload_file(file_service.file_path)

    await file_service.add_to_db(token)
    return {
        'hash_file_name': file_service.hash_name,
        'file_type': file_service.file_type,
    }


@router.post('/check-file')
async def check_file(file_name: str, token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    db_service = DatabaseService(db)
    file_id, status = await db_service.get_file_status(token, file_name)
    if status == 'DONE':
        summary = await db_service.get_summary(token, file_name)
        return {
            'status': status,
            'data': json.loads(summary)
        }

    return {'status': status}


@router.get('/get-user-meets')
async def get_user_meets(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    db_service = DatabaseService(db)
    result = await db_service.get_all_transcription(token)
    return result


@router.get("/me")
async def read_users_me(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    user = await auth_service.get_current_user(token)
    return user
