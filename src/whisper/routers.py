import json
import os.path
import aiofiles
import httpx
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.notifications.telegram import get_telegram_bot
from src.s3bucket.client import S3Client
from src.database_service import DatabaseService
from src.file_service import FileService
from src.whisper.summary import Summary
from src.whisper.whisper_service import WhisperService
from src.auth.routers import oauth2_scheme
from pathlib import Path

router = APIRouter()
dir = os.path.dirname(os.path.dirname(__file__))


async def send_request_to_process_file(file_name: str, token: str):
    headers = {
        "accept": "application/json",
    }
    async with httpx.AsyncClient(timeout=httpx.Timeout(20000.0)) as client:
        try:
            responce = await client.post(
                f"http://localhost:8081/process-file/{file_name}",
                headers=headers,
                cookies={"access_token": f'"Bearer {token}"'},
            )
            responce.raise_for_status()
            return responce.json()
        except Exception as e:
            print(f"Error sending request to whisper server: {e}")


@router.post("/upload-file/{file_name}")
async def upload_file(
    background_tasks: BackgroundTasks,
    file_name: str,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
    tg_bot=Depends(get_telegram_bot),
):
    s3_client = S3Client()
    try:
        byte_file, file_type = await s3_client.get_file(file_name)
    except Exception as e:
        raise HTTPException(status_code=404, detail="File not found")

    file_service = FileService(db, byte_file=byte_file)
    await file_service.save_bytes_file(file_name)

    tg_id = await DatabaseService(db).get_tg_id(token)
    if tg_id:
        background_tasks.add_task(
            tg_bot.send_message, tg_id, f"Файл: {file_name} успешно загружен!"
        )

    background_tasks.add_task(
        send_request_to_process_file, file_name.split(".")[0], token
    )

    return {
        "status": "success",
    }


@router.post("/process-file/{file_name}")
async def process_audio(
    background_tasks: BackgroundTasks,
    file_name: str,
    file_type: str = None,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
    tg_bot=Depends(get_telegram_bot),
):
    whisper = WhisperService(file_name, db)
    if not os.path.exists(whisper.file_path):
        raise HTTPException(status_code=404, detail="File not found")

    result = await whisper.run()
    transcription = await FileService.prepare_json(result)
    transcription = json.dumps(transcription, ensure_ascii=False, indent=4)
    file_path = Path(dir) / "files" / f"{file_name}.json"
    async with aiofiles.open(file_path, "w", encoding="utf-8") as f:
        await f.write(transcription)

    await whisper.add_to_db(token, transcription)

    summary = Summary(file_name, db)
    summarization = await summary.get_summary_from_transcription()
    summarization = json.dumps(summarization, ensure_ascii=False, indent=4)

    await summary.add_to_db(token, summarization)

    tg_id = await DatabaseService(db).get_tg_id(token)
    if tg_id:
        background_tasks.add_task(
            tg_bot.send_message, tg_id, f"Файл: {file_name}, успешно обработан!"
        )

    return {"status": "DONE", "transcription": transcription, "summary": summarization}
    # return {"status": "DONE", "transcription": transcription}


@router.post("/get-summary/{file_name}")
async def get_summary(
    background_tasks: BackgroundTasks,
    file_name: str,
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
    tg_bot=Depends(get_telegram_bot),
):
    try:
        summary = Summary(file_name, db)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail="File not found")

    summarization = await summary.get_summary_from_transcription()
    await summary.add_to_db(
        token, json.dumps(summarization, ensure_ascii=False, indent=4)
    )

    tg_id = await DatabaseService(db).get_tg_id(token)
    if tg_id:
        background_tasks.add_task(
            tg_bot.send_message,
            tg_id,
            f"Сгенерирована новая выжимка из файла: {file_name}",
        )

    return summarization
