import mysql.connector
from app.config.settings import DB_CONFIG


def get_connection():
    return mysql.connector.connect(
        host=DB_CONFIG["localhost"],
        user=DB_CONFIG["root"],  # usuário correto
        password=DB_CONFIG["senha123"],# senha
        database=DB_CONFIG["tcc"] # nome do banco
    )

