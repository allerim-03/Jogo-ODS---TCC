"""
===========================================================================
ROTAS DE AUTENTICAÇÃO

Responsabilidade:
- Receber as requisições HTTP.
- Extrair os dados enviados pelo Front-end.
- Chamar o serviço de autenticação.
- Retornar a resposta em JSON.

As regras de negócio NÃO ficam aqui.
Toda a lógica é delegada para auth_service.py.
--recebe requisições HTTP e retorna respostas.
===========================================================================
"""

from flask import Blueprint, request, jsonify

from app.services.auth_service import (
    cadastrar_usuario,
    autenticar_usuario
)

auth_bp = Blueprint("auth", __name__)


# ==========================================================================
# Cadastro
# ==========================================================================

@auth_bp.route("/api/cadastro", methods=["POST"])
def cadastro():

    data = request.get_json()

    resultado = cadastrar_usuario(data)

    return jsonify(resultado["body"]), resultado["status"]


# ==========================================================================
# Login
# ==========================================================================

@auth_bp.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    resultado = autenticar_usuario(data)

    return jsonify(resultado["body"]), resultado["status"]