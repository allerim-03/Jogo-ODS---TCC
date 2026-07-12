
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
from functools import wraps
from flask import jsonify, g
from flask_jwt_extended import (
    verify_jwt_in_request,
    get_jwt_identity
)
from flask_jwt_extended.exceptions import JWTExtendedException


def api_login_required(view):

    @wraps(view)
    def wrapper(*args, **kwargs):

        try:
            verify_jwt_in_request()

        except JWTExtendedException:

            return jsonify({
                "success": False,
                "message": "Unauthorized."
            }), 401

        g.current_user = get_jwt_identity()

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