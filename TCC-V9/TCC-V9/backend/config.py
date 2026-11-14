"""Configurações do servidor. Variáveis de ambiente sobrescrevem os padrões."""
import os
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent

class Config:
    FRONTEND_DIR = BASE_DIR.parent / 'frontend'
    DATABASE = os.environ.get('DATABASE_PATH', str(BASE_DIR / 'instance' / 'cultivando.sqlite3'))
    SECRET_KEY = os.environ.get('SECRET_KEY')
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_SECURE = os.environ.get('COOKIE_SECURE', '0') == '1'
    MAX_CONTENT_LENGTH = 2 * 1024 * 1024
    PORT = int(os.environ.get('PORT', '5000'))
    HOST = os.environ.get('HOST', '127.0.0.1')
