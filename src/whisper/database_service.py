from sqlalchemy.exc import NoResultFound
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.auth_service import AuthService
from src.auth.user_service import UserService
from src.database import User as DB_User, File as DB_File, Summary as DB_Summary
from sqlalchemy import select


class DatabaseService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_service = UserService(db)
        self.auth_service = AuthService(db)

    async def get_email(self, token: str) -> str:
        email = await self.auth_service.decode_token(token)
        return email

    async def get_user_id(self, token: str) -> int:
        email = await self.get_email(token)
        query = select(DB_User.id).where(email == DB_User.email)
        try:
            result = await self.db.execute(query)
            user_id = result.scalars().first()
        except NoResultFound:
            raise ValueError("User not found")
        return user_id

    async def get_file_id(self, token: str, file_name: str) -> int:
        user_id = await self.get_user_id(token)
        query = select(DB_File.id).where(file_name == DB_File.file_name, user_id == DB_File.user_id)
        try:
            result = await self.db.execute(query)
            file_id = result.scalars().first()
        except NoResultFound:
            raise ValueError("File not found")

        return file_id

    async def get_file_status(self, token: str, file_name: str):
        file_id = await self.get_file_id(token, file_name)
        query = select(DB_File.status).where(file_id == DB_File.id)
        try:
            result = await self.db.execute(query)
            status = result.scalars().first()
        except NoResultFound:
            raise ValueError("Status not found")
        return file_id, status

    async def get_transcription(self, token: str, file_name: str):
        file_id, status = await self.get_file_status(token, file_name)
        query = select(DB_Summary.transcription).where(file_id == DB_Summary.file_id)
        try:
            result = await self.db.execute(query)
            transcription = result.scalars().first()
        except NoResultFound:
            raise ValueError("Transcription not found")
        return transcription

    async def get_all_files_ids(self, token: str):
        user_id = await self.get_user_id(token)
        query = select(DB_File.id).where(user_id == DB_File.user_id)
        try:
            result = await self.db.execute(query)
            files_ids = [file.id for file in result]
        except NoResultFound:
            raise ValueError("Summary not found")
        return files_ids

    async def get_user_meets(self, token: str):
        files_ids = await self.get_all_files_ids(token)
        meet_arr = []
        for file_id in files_ids:
            query = select(DB_File.file_name).where(DB_File.id == file_id)
            try:
                result = await self.db.execute(query)
                meet_name = result.scalars().first()
                meet_arr.append(meet_name)
            except NoResultFound:
                raise ValueError("Summary not found")
        return {'meets': meet_arr}

    async def get_summarization(self, token: str, file_name: str):
        file_id = await self.get_file_id(token, file_name)
        query = select(DB_Summary.summarization).where(file_id == DB_Summary.file_id)
        try:
            result = await self.db.execute(query)
            summarization = result.scalars().first()
        except NoResultFound:
            raise ValueError("Summarization not found")
        return summarization
