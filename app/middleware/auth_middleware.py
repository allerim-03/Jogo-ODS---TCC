
"""
Middleware para proteger endpoints da API.

Fluxo:

1. Verifica se existe um JWT válido.
2. Extrai o usuário autenticado.
3. Armazena os dados em g.current_user.
4. Continua para a rota protegida.
"""
'''
auth_middleware.py
proteção das rotas na api
ler o header
validar jwt
colocar o usuario no flask
'''
"""
===========================================================================
AUTH MIDDLEWARE

Responsabilidade:

- Proteger endpoints que exigem autenticação.
- Validar a existência e a validade do JWT enviado pelo cliente.
- Identificar o usuário autenticado através do token.
- Buscar os dados atuais do usuário.
- Disponibilizar o usuário autenticado para as rotas através do objeto global
  do Flask (g.current_user).

Como funciona um middleware:

O middleware fica entre a requisição do cliente e a execução da rota.

Fluxo:

Cliente
   |
   |  Envia requisição + JWT no Header Authorization
   |
   ↓
Middleware
   |
   |  Verifica se o token existe e é válido
   |
   |  Extrai o ID do usuário
   |
   |  Busca usuário no banco
   |
   |  Armazena em g.current_user
   |
   ↓
Rota protegida

A rota só é executada caso a autenticação seja válida.

Exemplo:

GET /api/me

Header:

Authorization: Bearer TOKEN

Se o token for válido:
    → rota continua

Se o token for inválido:
    → retorna erro 401 Unauthorized

===========================================================================
"""

from functools import wraps

from flask import jsonify, g

from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt_identity
)

from flask_jwt_extended.exceptions import JWTExtendedException

from app.repositories.user_repository import UserRepository


user_repository = UserRepository()



def api_login_required(view):

    """
    Decorator utilizado para proteger rotas da API.

    Qualquer rota que possuir esse decorator
    exigirá um JWT válido.
    """

    @wraps(view)
    def wrapper(*args, **kwargs):

        try:

            # Verifica se existe um JWT válido no Header Authorization
            verify_jwt_in_request()


        except JWTExtendedException:

            return jsonify({

                "success": False,

                "message": "Unauthorized."

            }), 401



        # Recupera o ID salvo no token JWT
        user_id = get_jwt_identity()



        # Busca os dados atuais do usuário no banco
        user = user_repository.get_by_id(
            int(user_id)
        )


        if not user:

            return jsonify({

                "success": False,

                "message": "User not found."

            }), 404



        # Disponibiliza o usuário para a rota
        g.current_user = user


        return view(*args, **kwargs)


    return wrapper
  

'''

versão com autenticação manual
from functools import wraps
from flask import request, jsonify, g
from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt_identity
)
from app.services.security_service import verify_token


def login_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({
                "success": False,
                "message": "Token not provided."
            }), 401

        if not auth_header.startswith("Bearer "):
            return jsonify({
                "success": False,
                "message": "Invalid authorization header."
            }), 401

        token = auth_header.replace("Bearer ", "")

        payload = verify_token(token)

        if payload is None:
            return jsonify({
                "success": False,
                "message": "Invalid or expired token."
            }), 401

        g.current_user = payload

        return func(*args, **kwargs)

    return wrapper


def api_login_required(func):

    @wraps(func)
    def wrapper(*args, **kwargs):

        try:
            verify_jwt_in_request()

        except Exception:
            return jsonify({
                "success": False,
                "message": "Unauthorized."
            }), 401

        g.current_user = get_jwt_identity()

        return func(*args, **kwargs)

    return wrapper
    '''