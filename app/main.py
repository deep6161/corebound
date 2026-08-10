from fastapi import FastAPI
from sqlalchemy import text

from app.core.settings import settings
from app.db.session import engine
from app.ai.gemini_client import gemini_client
from app.api.v1.ai import router as ai_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)
app.include_router(ai_router)


@app.get("/")
def root():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))
        db_version = result.scalar()

    return {
        "message": "Corebound Backend Running 🚀",
        "database": db_version,
    }