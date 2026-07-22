from fastapi import FastAPI

from app.core.settings import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)


@app.get("/")
async def root():
    return {
        "message": "Welcome to Corebound Backend 🚀",
        "version": settings.APP_VERSION,
    }