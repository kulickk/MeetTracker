import json
import os.path

import aiofiles
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.whisper.file_service import FileService
from src.whisper.whisper_service import WhisperService
from src.auth.routers import oauth2_scheme

router = APIRouter()


@router.post("/process-file/")
async def process_audio(file_name: str, file_type: str, token: str = Depends(oauth2_scheme),
                        db: AsyncSession = Depends(get_db)):
    path = os.path.join(os.path.dirname(__file__), 'files', f'{file_name}.wav')
    if not os.path.exists(path):
        raise HTTPException(status_code=400, detail="File not found")

    whisper = WhisperService(file_name, db)
    result = await whisper.run()
    prepared_data = await FileService.prepare_json(result)
    data = json.dumps(prepared_data, ensure_ascii=False, indent=4)

    async with aiofiles.open(f'files/{file_name}.json', 'w', encoding='utf-8') as f:
        await f.write(data)

    await whisper.add_to_db(token, prepared_data)

    os.remove(path)
    return {
        'status': 'DONE',
        'data': prepared_data
    }
