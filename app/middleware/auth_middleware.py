'''
auth_middleware.py
proteção das rotas na api
ler o header
validar jwt
colocar o usuario no flask
'''
from functools import wraps
from flask import request, jsonify, g

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