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

from app.services.auth_service import AuthService

auth_service = AuthService()

auth_bp = Blueprint("auth", __name__)


# ==========================================================================
# Cadastro
# ==========================================================================

@auth_bp.route("/api/register", methods=["POST"])
def register():

    data = request.get_json()

    result = auth_service.register_user(data)

    return jsonify(result["body"]), result["status"]


# ==========================================================================
# Login
# ==========================================================================

@auth_bp.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    result = auth_service.login_user(data)

    return jsonify(result["body"]), result["status"]

#POST /api/logout (futuro)

#GET /api/me (futuro)
#POST /refresh

'''
--melhoria para o futuro
@routes.route('/login', methods=['POST'])
def login_post():

    email = request.form.get('email')
    senha = request.form.get('senha')
    tipo_usuario = request.form.get('tipo_usuario')

    print(email, senha, tipo_usuario)

    return redirect('/dashboard')
'''
