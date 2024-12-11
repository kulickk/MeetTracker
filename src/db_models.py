from datetime import datetime

from sqlalchemy import MetaData, Integer, String, TIMESTAMP, ForeignKey, Column, Table, JSON, Boolean

metadata = MetaData()

user = Table(
    "user",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("telegram_id", String, unique=True, nullable=True),
    Column("link_code", String, unique=True, nullable=True),
    Column("name", String, unique=False, nullable=False),
    Column("surname", String, unique=False, nullable=False),
    Column("patronymic", String, unique=False, nullable=False),
    Column("email", String, unique=True, nullable=False),
    Column("hashed_password", String, nullable=False),
    Column("is_active", Boolean, default=True),
    Column("is_admin", Boolean, default=False),
    Column("is_banned", Boolean, default=False),
    Column("created_at", TIMESTAMP, default=datetime.utcnow),
    Column("updated_at", TIMESTAMP, default=datetime.utcnow),
)

file = Table(
    "file",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("user_id", Integer, ForeignKey('user.id'), nullable=False),
    Column("file_name", String, nullable=False),
    Column("file_type", String, nullable=False),
    Column("status", String, nullable=False),
    Column("uploaded_at", TIMESTAMP, default=datetime.utcnow),
    Column("updated_at", TIMESTAMP, default=datetime.utcnow)
)

summary = Table(
    "summary",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("file_id", Integer, ForeignKey('file.id'), unique=True, nullable=False),
    Column("transcription", JSON, nullable=False),
    Column("summarization", JSON),
    Column("created_at", TIMESTAMP, default=datetime.utcnow),
    Column("uploaded_at", TIMESTAMP, default=datetime.utcnow)
)
