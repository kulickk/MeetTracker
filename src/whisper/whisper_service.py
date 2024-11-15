import asyncio
import os

from datetime import datetime
from src.whisper.database_service import DatabaseService
from src.whisper.packages.audio_processor import AudioProcessor
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update, insert
from src.database import File as DB_File, Summary as DB_Summary


class WhisperService:
    def __init__(self, file_name, db: AsyncSession):
        whisper_dir = os.path.dirname(__file__)
        self.file_path = os.path.join(whisper_dir, "files", f"{file_name}.wav")
        self.file_name = self.file_path.split('\\')[-1].split('.')[0]
        self.device = "cuda"
        self.model_name = "large-v2"
        self.db = db
        self.db_service = DatabaseService(db)

    async def run(self):
        try:
            processor = AudioProcessor(file_path=self.file_path, device=self.device, model_name=self.model_name)
            return await asyncio.to_thread(processor.process)
        except Exception as e:
            processor = AudioProcessor(file_path=self.file_path, device='cpu', model_name=self.model_name)
            return await asyncio.to_thread(processor.process)

    async def add_to_db(self, token: str, transcription_data):
        file_id = await self.db_service.get_file_id(token, self.file_name)

        insert_summary = insert(DB_Summary).values(
            file_id=file_id,
            transcription=transcription_data,
            created_at=datetime.utcnow(),
            uploaded_at=datetime.utcnow()
        )

        update_file = update(DB_File).where(file_id == DB_File.id).values(
            status="DONE",
            updated_at=datetime.utcnow()
        )

        await self.db.execute(insert_summary)
        await self.db.execute(update_file)
        await self.db.commit()
