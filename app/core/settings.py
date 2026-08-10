from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ==========================================
    # Application
    # ==========================================
    APP_NAME: str
    APP_VERSION: str
    DEBUG: bool

    HOST: str
    PORT: int

    # ==========================================
    # Database
    # ==========================================
    DATABASE_URL: str

    # ==========================================
    # Authentication
    # ==========================================
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # ==========================================
    # Gemini AI
    # ==========================================
    GEMINI_API_KEY: str
    GEMINI_MODEL: str

    # ==========================================
    # Environment Configuration
    # ==========================================
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",      # Ignore unknown variables in .env
    )


settings = Settings()