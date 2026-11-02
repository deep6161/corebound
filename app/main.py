from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.api.v1.adaptive import router as adaptive_router
from app.api.v1.ai import router as ai_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.auth import router as auth_router
from app.api.v1.challenges import router as challenges_router
from app.api.v1.gameplay import router as gameplay_router
from app.api.v1.missions import router as missions_router
from app.api.v1.performance import router as performance_router
from app.api.v1.progress import router as progress_router
from app.api.v1.rewards import router as rewards_router
from app.api.v1.story import router as story_router
from app.api.v1.subjects import router as subjects_router
from app.api.v1.topics import router as topics_router
from app.api.v1.users import router as users_router
from app.core.settings import settings
from app.db.database import engine

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Existing routers
app.include_router(ai_router)

app.include_router(subjects_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")

# Phase 1 routers
app.include_router(users_router, prefix="/api/v1")
app.include_router(story_router, prefix="/api/v1")
app.include_router(topics_router, prefix="/api/v1")
app.include_router(missions_router, prefix="/api/v1")
app.include_router(progress_router, prefix="/api/v1")
app.include_router(performance_router, prefix="/api/v1")
app.include_router(rewards_router, prefix="/api/v1")
app.include_router(analytics_router, prefix="/api/v1")

# Phase 2 routers
app.include_router(gameplay_router, prefix="/api/v1")

# Phase V16 Adaptive Router
app.include_router(adaptive_router, prefix="/api/v1")

# Phase V17 Challenges Router
app.include_router(challenges_router, prefix="/api/v1")



@app.get("/")
def root():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))
        db_version = result.scalar()

    return {
        "message": "Corebound Backend Running 🚀",
        "database": db_version,
    }