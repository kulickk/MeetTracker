"""Initial migration

Revision ID: 1fae149e2e48
Revises: 
Create Date: 2024-10-07 13:16:19.490583

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = '1fae149e2e48'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('user',
                    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
                    sa.Column('username', sa.String(), nullable=False),
                    sa.Column('email', sa.String(), nullable=False),
                    sa.Column('hashed_password', sa.String(), nullable=False),
                    sa.Column('is_active', sa.Boolean(), nullable=True),
                    sa.Column('is_superuser', sa.Boolean(), nullable=True),
                    sa.Column('created_at', sa.TIMESTAMP(), nullable=True),
                    sa.Column('updated_at', sa.TIMESTAMP(), nullable=True),
                    sa.Column('is_verified', sa.Boolean(), nullable=False),
                    sa.PrimaryKeyConstraint('id'),
                    sa.UniqueConstraint('email'),
                    sa.UniqueConstraint('username')
                    )
    op.create_table('file',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('user_id', sa.Integer(), nullable=False),
                    sa.Column('file_name', sa.String(), nullable=False),
                    sa.Column('file_path', sa.String(), nullable=False),
                    sa.Column('uploaded_at', sa.TIMESTAMP(), nullable=True),
                    sa.Column('status', sa.String(), nullable=False),
                    sa.Column('result_link', sa.String(), nullable=True),
                    sa.Column('file_type', sa.String(), nullable=False),
                    sa.Column('processed_audio_path', sa.String(), nullable=True),
                    sa.Column('updated_at', sa.TIMESTAMP(), nullable=True),
                    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
                    sa.PrimaryKeyConstraint('id')
                    )
    op.create_table('summary',
                    sa.Column('id', sa.Integer(), nullable=False),
                    sa.Column('file_id', sa.Integer(), nullable=False),
                    sa.Column('summary_text', sa.String(), nullable=False),
                    sa.Column('created_at', sa.TIMESTAMP(), nullable=True),
                    sa.Column('uploaded_at', sa.TIMESTAMP(), nullable=True),
                    sa.ForeignKeyConstraint(['file_id'], ['file.id'], ),
                    sa.PrimaryKeyConstraint('id'),
                    sa.UniqueConstraint('file_id')
                    )


def downgrade() -> None:
    op.drop_table('summary')
    op.drop_table('file')
    op.drop_table('user')

