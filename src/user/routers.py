import json
import os
import uuid

import httpx
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from src.auth.auth_service import AuthService
from src.auth.routers import oauth2_scheme
from src.auth.schemas import UpdateUserInfo
from src.config import TELEGRAM_BOT_USERNAME
from src.database import get_db
from src.s3bucket.client import S3Client
from src.user.allowed_content import ALLOWED_CONTENT_TYPES
from src.database_service import DatabaseService
from src.file_service import FileService

router = APIRouter(prefix="/users", tags=["users"])


async def send_request_to_whisper_server(file_name: str, token: str):
    headers = {
        "accept": "application/json",
    }
    async with httpx.AsyncClient(timeout=httpx.Timeout(20.0)) as client:
        try:
            responce = await client.post(
                f"http://whisper:8081/upload-file/{file_name}",
                headers=headers,
                cookies={"access_token": f'"Bearer {token}"'},
            )
            responce.raise_for_status()
            return responce.json()
        except Exception as e:
            print(f"Error sending request to whisper server: {e}")


@router.post("/update-user-info")
async def update_user_info(
    info: UpdateUserInfo,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    database_service = DatabaseService(db)
    email = await database_service.get_email(token)
    user = await database_service.user_service.get_user_by_email(email)
    if user:
        if info.new_password:
            await database_service.auth_service.change_password(
                info.old_password, info.new_password, email
            )

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


@router.get("/generate-link-tg")
async def generate_link_tg(
    token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)
):
    link_code = str(uuid.uuid4())
    await DatabaseService(db).set_tg_link_code(token, link_code)
    telegram_link = f"https://t.me/{TELEGRAM_BOT_USERNAME}?start={link_code}"
    return {"telegram_link": telegram_link}


@router.post("/upload-file")
async def upload_file(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported Media Type")

    file_service = FileService(db, file=file)

    s3_client = S3Client()
    file_name = file_service.hash_name + "." + file_service.file_type
    await s3_client.upload_file(file_name, file.file.read())

    await file_service.add_to_db(token)
    background_tasks.add_task(send_request_to_whisper_server, file_name, token)
    return {
        "hash_file_name": file_service.hash_name,
        "file_type": file_service.file_type,
    }


@router.get("/check-file")
async def check_file(
    file_name: str,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    db_service = DatabaseService(db)
    file_id, transcription_status, summary_status = await db_service.get_file_status(token, file_name)
    transcription = await db_service.get_transcription(token, file_name)
    summarization = await db_service.get_summarization(token, file_name)
    uploaded_at, updated_at, meet_type = await db_service.get_file_stats(
        token, file_name
    )
    return {
        "transcription_status": transcription_status,
        "summary_status": summary_status,
        "meet_name": file_name,
        "meet_type": meet_type,
        "transcription": (
            json.loads(transcription) if transcription is not None else None
        ),
        "summarization": (
            json.loads(summarization) if summarization is not None else None
        ),
        "uploaded_at": uploaded_at,
        "updated_at": updated_at,
    }


@router.get("/download-file")
async def download_file(
    background_tasks: BackgroundTasks,
    file_name: str,
    file_type: str,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    full_name = file_name + "." + file_type
    s3_client = S3Client()
    byte_file, byte_type = await s3_client.get_file(full_name)

    file_service = FileService(db, byte_file=byte_file)
    file_path = await file_service.save_from_s3(file_name, file_type)

    background_tasks.add_task(os.remove, file_path)

    return FileResponse(path=file_path, filename=full_name, media_type=byte_type)


@router.get("/get-user-meets")
async def get_user_meets(
    token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)
):
    db_service = DatabaseService(db)
    result = await db_service.get_user_meets(token)
    return result


@router.get("/me")
async def read_users_me(
    token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)
):
    auth_service = AuthService(db)
    user = await auth_service.get_current_user(token)
    return user
