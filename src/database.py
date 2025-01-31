from datetime import datetime

from sqlalchemy import Integer, String, Boolean, TIMESTAMP, ForeignKey, JSON
from sqlalchemy.orm import Mapped, DeclarativeBase, mapped_column, relationship

from src.config import DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME

from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine, async_session

DATABASE_URL = f'postgresql+asyncpg://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}'


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = 'user'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    telegram_id: Mapped[str] = mapped_column(String, unique=True, nullable=True)
    link_code: Mapped[str] = mapped_column(String, unique=True, nullable=True)
    name: Mapped[str] = mapped_column(String, unique=False, nullable=False)
    surname: Mapped[str] = mapped_column(String, unique=False, nullable=False)
    patronymic: Mapped[str] = mapped_column(String, unique=False, nullable=False)
    email: Mapped[str] = mapped_column(String(length=320), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(length=1024), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_banned: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[TIMESTAMP] = mapped_column(TIMESTAMP, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[TIMESTAMP] = mapped_column(TIMESTAMP, default=datetime.utcnow, nullable=False)

    files: Mapped[list['File']] = relationship(
        'File', back_populates='owner', cascade='all, delete-orphan'
    )


class File(Base):
    __tablename__ = 'file'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey('user.id'), nullable=False)
    file_name: Mapped[str] = mapped_column(String, nullable=False)
    transcription_status: Mapped[str] = mapped_column(String, nullable=False)
    summary_status: Mapped[str] = mapped_column(String, nullable=False)
    file_type: Mapped[str] = mapped_column(String, nullable=False)
    uploaded_at: Mapped[TIMESTAMP] = mapped_column(TIMESTAMP, default=datetime.utcnow)
    updated_at: Mapped[TIMESTAMP] = mapped_column(TIMESTAMP, default=datetime.utcnow)

    owner: Mapped['User'] = relationship(
        'User', back_populates='files'
    )
    summary: Mapped['Summary'] = relationship(
        'Summary', back_populates='file', uselist=False, cascade='all, delete-orphan'
    )


class Summary(Base):
    __tablename__ = 'summary'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    file_id: Mapped[int] = mapped_column(Integer, ForeignKey('file.id'), unique=True, nullable=False)
    transcription: Mapped[str] = mapped_column(JSON, nullable=False)
    summarization: Mapped[str] = mapped_column(JSON)
    created_at: Mapped[TIMESTAMP] = mapped_column(TIMESTAMP, default=datetime.utcnow)
    uploaded_at: Mapped[TIMESTAMP] = mapped_column(TIMESTAMP, default=datetime.utcnow)

    file: Mapped['File'] = relationship(
        'File', back_populates='summary'
    )


engine = create_async_engine(DATABASE_URL)
async_session_db = async_sessionmaker(engine, expire_on_commit=False)


async def get_db():
    session = async_session_db()
    try:
        yield session
    finally:
        await session.close()
