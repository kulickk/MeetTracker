from datetime import datetime

from sqlalchemy import MetaData, Integer, String, TIMESTAMP, ForeignKey, Column, Table, JSON, Boolean

metadata = MetaData()

users = Table(
    "users",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("username", String, unique=True, nullable=False),
    Column("email", String, unique=True, nullable=False),
    Column("hashed_password", String, nullable=False),
    Column("is_active", Boolean, default=True),
    Column("is_superuser", Boolean, default=False),
    Column("created_at", TIMESTAMP, default=datetime.utcnow),
    Column("updated_at", TIMESTAMP, default=datetime.utcnow),
)

files = Table(
    "files",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), nullable=False),
    Column("file_name", String, nullable=False),
    Column("file_path", String, nullable=False),
    Column("uploaded_at", TIMESTAMP, default=datetime.utcnow),
    Column("status", String, nullable=False),
    Column("result_link", String),
    Column("file_type", String, nullable=False),
    Column("processed_audio_path", String),
    # Column("error_message", TEXT, default=datetime.utcnow), пока не знаю как правильно оформить
    Column("updated_at", TIMESTAMP, default=datetime.utcnow),
)

summaries = Table(
    "summaries",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("file_id", Integer, ForeignKey("files.id"), unique=True, nullable=False),
    Column("summary_text", String, nullable=False),
    Column("created_at", TIMESTAMP, default=datetime.utcnow),
    Column("uploaded_at", TIMESTAMP, default=datetime.utcnow),
)
