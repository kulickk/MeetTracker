import os
import uuid
import aiofiles
import jwt
from pydub import AudioSegment
from sqlalchemy.exc import NoResultFound

from src.auth.auth_service import AuthService
from src.config import SECRET_KEY, ALGORITHM
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status, UploadFile
from sqlalchemy import select, insert
from src.database import User as DB_User
from src.database import File as DB_File
from src.whisper.database_service import DatabaseService


class FileService:
    def __init__(self, file: UploadFile, db: AsyncSession):
        self.file = file
        self.file_name = self.file.filename.split('.')[0]
        self.file_type = self.file.filename.split('.')[1]
        self.hash_name = self.file_name + "_" + str(uuid.uuid4().hex)
        whisper_dir = os.path.dirname(__file__)
        self.file_path = os.path.join(whisper_dir, "files", f"{self.hash_name}.wav")
        self.temp_files_path = os.path.join(whisper_dir, "temp_files", f"{self.hash_name}.wav")
        self.db = db
        self.db_service = DatabaseService(db)

    async def save_file(self):
        async with aiofiles.open(self.temp_files_path, 'wb') as out_file:
            content = await self.file.read()
            await out_file.write(content)

        audio = AudioSegment.from_file(self.temp_files_path)
        if audio.channels == 2:
            audio = audio.set_channels(1)

        audio.export(self.file_path)
        os.remove(self.temp_files_path)

    async def delete_file(self):
        if os.path.exists(self.file_path):
            os.remove(self.file_path)

    async def add_to_db(self, token: str):
        user_id = await self.db_service.get_user_id(token)

        new_file = {
            "user_id": user_id,
            "file_name": self.hash_name,
            "file_path": self.file_path,
            "status": "PENDING",
            "file_type": self.file_type
        }

        await self.db.execute(insert(DB_File).values(new_file))
        await self.db.commit()
