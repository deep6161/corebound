"""add_current_phase_to_gameplay_sessions

Revision ID: 764f6a036dc7
Revises: 86e287c0be18
Create Date: 2026-09-27 21:55:43.853773

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '764f6a036dc7'
down_revision: Union[str, Sequence[str], None] = '86e287c0be18'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('gameplay_sessions', sa.Column('current_phase', sa.Integer(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('gameplay_sessions', 'current_phase')
