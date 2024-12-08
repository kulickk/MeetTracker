import json
import os.path

import aiofiles
import httpx
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.s3bucket.client import S3Client
from src.whisper.file_service import FileService
from src.whisper.summary import Summary
from src.whisper.whisper_service import WhisperService
from src.auth.routers import oauth2_scheme

router = APIRouter()


async def send_request_to_process_file(file_name: str, token: str):
    headers = {
        'accept': 'application/json',
    }
    async with httpx.AsyncClient(timeout=httpx.Timeout(20000.0)) as client:
        try:
            responce = await client.post(
                f"http://localhost:8081/process-file/{file_name}",
                headers=headers,
                cookies={"access_token": f'"Bearer {token}"'}
            )
            responce.raise_for_status()
            return responce.json()
        except Exception as e:
            print(f"Error sending request to whisper server: {e}")


@router.post("/upload-file/{file_name}")
async def upload_file(background_tasks: BackgroundTasks, file_name: str, token: str = Depends(oauth2_scheme),
                      db: AsyncSession = Depends(get_db)):
    s3_client = S3Client()
    byte_file, file_type = await s3_client.get_file(file_name)

    file_service = FileService(db, byte_file=byte_file)
    await file_service.save_bytes_file(file_name)

    background_tasks.add_task(send_request_to_process_file, file_name.split('.')[0], token)
    return {
        'status': 'success',
    }


@router.post("/process-file/{file_name}")
async def process_audio(file_name: str, file_type: str = None, token: str = Depends(oauth2_scheme),
                        db: AsyncSession = Depends(get_db)):
    whisper = WhisperService(file_name, db)
    if not os.path.exists(whisper.file_path):
        raise HTTPException(status_code=400, detail="File not found")

    result = await whisper.run()
    transcription = await FileService.prepare_json(result)
    transcription = json.dumps(transcription, ensure_ascii=False, indent=4)

    async with aiofiles.open(f'files/{file_name}.json', 'w', encoding='utf-8') as f:
        await f.write(transcription)

    await whisper.add_to_db(token, transcription)

    summary = Summary(file_name, db)
    summarization = await summary.get_summary_from_transcription()
    summarization = json.dumps(summarization, ensure_ascii=False, indent=4)

    await summary.add_to_db(token, summarization)

    return {
        'status': 'DONE',
        'transcription': transcription,
        'summary': summarization
    }


@router.post("/get-summary/{file_name}")
async def get_summary(file_name: str, token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    summary = Summary(file_name, db)

    summarization = await summary.get_summary_from_transcription()
    summarization = json.dumps(summarization, ensure_ascii=False, indent=4)
    await summary.add_to_db(token, summarization)

    return summarization
