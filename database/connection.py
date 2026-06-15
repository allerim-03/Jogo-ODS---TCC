import mysql.connector
from app.config.settings import DB_CONFIG


def get_connection():
    return mysql.connector.connect(
        host=DB_CONFIG["host"], #ou "localhost"
        user=DB_CONFIG["user"],  # usuário correto
        password=DB_CONFIG["password"],# senha
        database=DB_CONFIG["database"] # nome do banco
    )



