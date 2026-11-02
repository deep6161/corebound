"""add_user_preferences_to_user_profiles

Revision ID: 86e287c0be18
Revises: 372ab790561d
Create Date: 2026-09-15 09:09:01.730375

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '86e287c0be18'
down_revision: Union[str, Sequence[str], None] = '372ab790561d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('user_profiles', sa.Column('goal', sa.String(length=100), nullable=True))
    op.add_column('user_profiles', sa.Column('target_role', sa.String(length=100), nullable=True))
    op.add_column('user_profiles', sa.Column('skill_level', sa.String(length=50), nullable=True))
    op.add_column('user_profiles', sa.Column('subjects', sa.JSON(), nullable=True))
    op.add_column('user_profiles', sa.Column('daily_time', sa.String(length=50), nullable=True))
    op.add_column('user_profiles', sa.Column('difficulty_preference', sa.String(length=50), server_default='Adaptive', nullable=True))
    op.add_column('user_profiles', sa.Column('learning_preference', sa.String(length=50), nullable=True))
    op.add_column('user_profiles', sa.Column('preferences_updated_at', sa.DateTime(timezone=True), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('user_profiles', 'preferences_updated_at')
    op.drop_column('user_profiles', 'learning_preference')
    op.drop_column('user_profiles', 'difficulty_preference')
    op.drop_column('user_profiles', 'daily_time')
    op.drop_column('user_profiles', 'subjects')
    op.drop_column('user_profiles', 'skill_level')
    op.drop_column('user_profiles', 'target_role')
    op.drop_column('user_profiles', 'goal')
