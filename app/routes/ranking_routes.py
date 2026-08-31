#ranking geral

#ranking turma

#ranking escola

#===========================
# Ranking.py
#=========================



"""
===========================================================================
ROTAS DE RANKING

Responsabilidades:
- Receber requisições HTTP.
- Validar autenticação.
- Chamar RankingService.
- Retornar respostas JSON.
===========================================================================
"""

from flask import Blueprint, jsonify, g

from app.middleware.auth_middleware import api_login_required
from app.services.ranking_service import RankingService


ranking_bp = Blueprint(
    "ranking",
    __name__
)

ranking_service = RankingService()


# ==========================================================================
# RANKING GERAL
# ==========================================================================

@ranking_bp.route(
    "/api/ranking",
    methods=["GET"]
)
@api_login_required
def get_ranking():

    result = ranking_service.get_global_ranking()

    return jsonify(result), 200


# ==========================================================================
# POSIÇÃO DO USUÁRIO LOGADO
# ==========================================================================

@ranking_bp.route(
    "/api/ranking/me",
    methods=["GET"]
)
@api_login_required
def get_my_ranking():

    result = ranking_service.get_user_ranking(
        g.current_user.id
    )

    status = 200 if result["success"] else 404

    return jsonify(result), status

'''
routas futuras junto com o sistema de turmas 
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
'''