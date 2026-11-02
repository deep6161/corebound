import logging
import time
from google import genai

from app.core.settings import settings

logger = logging.getLogger(__name__)


class GeminiClient:
    def __init__(self):
        self._init_client()
        self.model = settings.GEMINI_MODEL

    def _init_client(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

    def generate(self, prompt: str) -> str:
        max_attempts = 4
        last_error = None
        for attempt in range(1, max_attempts + 1):
            try:
                response = self.client.models.generate_content(
                    model=self.model,
                    contents=prompt,
                )
                if response and response.text:
                    return response.text
                raise ValueError("Gemini returned an empty response")
            except Exception as exc:
                last_error = exc
                err_msg = str(exc)
                if attempt < max_attempts and any(
                    code.lower() in err_msg.lower()
                    for code in [
                        "503", "unavailable", "connecterror", "remoteprotocolerror",
                        "resourceexhausted", "429", "eof", "disconnected", "protocolerror", "timed out", "timeout",
                        "getaddrinfo", "11001", "connection", "socket", "reset"
                    ]
                ):
                    wait_time = attempt * 2
                    logger.warning(
                        f"Gemini API transient failure (attempt {attempt}/{max_attempts}): {err_msg}. Retrying in {wait_time}s..."
                    )
                    time.sleep(wait_time)
                    self._init_client()
                    continue
                raise exc
        raise last_error


gemini_client = GeminiClient()