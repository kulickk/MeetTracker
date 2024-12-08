import io
import os
import uuid
import aiofiles
from pydub import AudioSegment

from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import UploadFile
from sqlalchemy import insert
from src.database import File as DB_File
from src.whisper.database_service import DatabaseService


class FileService:
    def __init__(self, db: AsyncSession, file: UploadFile = None, byte_file=None):
        self.file = file
        self.byte_file = byte_file
        self.whisper_dir = os.path.dirname(__file__)
        if file is not None:
            self.file_name = self.file.filename.split('.')[0]
            self.file_type = self.file.filename.split('.')[1]
            self.hash_name = self.file_name + "_" + str(uuid.uuid4().hex)
            self.file_path = os.path.join(self.whisper_dir, "files", f"{self.hash_name}.wav")
            self.temp_files_path = os.path.join(self.whisper_dir, "temp_files", f"{self.hash_name}.wav")
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

    async def save_bytes_file(self, file_name):
        file_name = file_name.split('.')[0]
        file_path = os.path.join(self.whisper_dir, "files", f"{file_name}.wav")
        audio_stream = io.BytesIO(self.byte_file)
        audio = AudioSegment.from_file(audio_stream)
        if audio.channels == 2:
            audio = audio.set_channels(1)
        audio.export(file_path)

    async def delete_file(self):
        if os.path.exists(self.file_path):
            os.remove(self.file_path)

    async def add_to_db(self, token: str):
        user_id = await self.db_service.get_user_id(token)

        new_file = {
            "user_id": user_id,
            "file_name": self.hash_name,
            "status": "PENDING",
            "file_type": self.file_type
        }

        await self.db.execute(insert(DB_File).values(new_file))
        await self.db.commit()

    @staticmethod
    async def prepare_json(data):
        output_data = [
            {
                'text': data['text']
            }
        ]

        for segment in data["segments"]:
            output_data.append({
                "type": "string",
                "speaker_id": str(segment["speaker"]),
                "text": segment["text"],
                "start_time": str(segment["start"]),
                "stop_time": str(segment["end"]),
            })
        return output_data
