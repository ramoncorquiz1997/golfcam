import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    PORT = int(os.getenv("PORT", 5055))
    # DB
    PGHOST = os.getenv("PGHOST", "localhost")
    PGPORT = int(os.getenv("PGPORT", 5432))
    PGDATABASE = os.getenv("PGDATABASE", "clipsazo")
    PGUSER = os.getenv("PGUSER", "clipsazo")
    PGPASSWORD = os.getenv("PGPASSWORD", "")
    # CORS
    CORS_ORIGINS = [s.strip() for s in os.getenv("CORS_ORIGINS", "*").split(",") if s.strip()]

class DevConfig(Config):
    DEBUG = True

class ProdConfig(Config):
    DEBUG = False

def get_config():
    env = os.getenv("FLASK_ENV", "production").lower()
    return DevConfig if env.startswith("dev") else ProdConfig