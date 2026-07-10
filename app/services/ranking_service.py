

from app.repositories.user_repository import UserRepository


user_repository = UserRepository()


def get_ranking_data():

    return user_repository.get_ranking()


''' futuro rancking route

from flask import Blueprint, jsonify
import mysql.connector
from app.database.connection import get_connection
ranking_bp = Blueprint(
    "ranking",
    __name__
)

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="senha123",
    database="tcc"
)

@ranking_bp.route("/ranking", methods=["GET"])
def ranking():

    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            name,
            xp,
            level
        FROM users
        ORDER BY xp DESC
    """)

    usuarios = cursor.fetchall()

    cursor.close()

    return jsonify(usuarios)
'''

'''
ranking = []

for posicao, usuario in enumerate(usuarios, start=1):

    ranking.append({
        "position": posicao,
        "name": usuario["name"],
        "xp": usuario["xp"],
        "level": usuario["level"]
    })

return jsonify(ranking)
from app.repositories.user_repository import get_ranking
from app.repositories.user_repository import UserRepository
user_repository = UserRepository()

def get_ranking_data():

    return get_ranking()
'''