#ranking geral

#ranking turma

#ranking escola

#===========================
# Ranking.py
#=========================
'from app.services.ranking_service -- get_ranking_data'


"""
===========================================================================
ROTAS DE RANKING

Responsabilidades:
- Receber requisições HTTP.
- Chamar RankingService.
- Retornar respostas JSON.
===========================================================================
"""

from flask import Blueprint, jsonify

from app.middleware.auth_middleware import api_login_required
from app.services.ranking_service import RankingService


ranking_bp = Blueprint("ranking", __name__)

ranking_service = RankingService()


# ==========================================================================
# Ranking Geral
# ==========================================================================

@ranking_bp.route("/api/ranking", methods=["GET"])
@api_login_required
def get_ranking():

    result = ranking_service.get_global_ranking()

    return jsonify(result)


# ==========================================================================
# Ranking da Turma
# ==========================================================================

@ranking_bp.route("/api/ranking/classroom/<int:classroom_id>", methods=["GET"])
@api_login_required
def get_classroom_ranking(classroom_id):

    result = ranking_service.get_classroom_ranking(classroom_id)

    return jsonify(result)


# ==========================================================================
# Ranking da Escola
# ==========================================================================

@ranking_bp.route("/api/ranking/school/<int:school_id>", methods=["GET"])
@api_login_required
def get_school_ranking(school_id):

    result = ranking_service.get_school_ranking(school_id)

    return jsonify(result)