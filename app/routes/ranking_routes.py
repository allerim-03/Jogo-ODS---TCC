#ranking geral

#ranking turma

#ranking escola

#===========================
# Ranking.py
#=========================
from app.services.ranking_service import get_ranking_data

@routes.route("/api/ranking")
def api_ranking():
    return jsonify(get_ranking_data())

