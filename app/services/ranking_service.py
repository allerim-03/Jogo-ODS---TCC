from flask import Blueprint, jsonify
import mysql.connector

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
ranking = []

for posicao, usuario in enumerate(usuarios, start=1):

    ranking.append({
        "position": posicao,
        "name": usuario["name"],
        "xp": usuario["xp"],
        "level": usuario["level"]
    })

return jsonify(ranking)

'''