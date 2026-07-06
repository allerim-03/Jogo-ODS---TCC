from flask import jsonify
from werkzeug.security import (
    generate_password_hash,
    check_password_hash
)
from flask_jwt_extended import create_access_token

from app.extensions import db
from app.models.user import User


def cadastrar_usuario(data):

    nome = data.get("nome")
    email = data.get("email")
    senha = data.get("senha")
    perfil = data.get("perfil")

    ...

    def autenticar_usuario(data):

    email = data.get("email")
    senha = data.get("senha")
    perfil = data.get("perfil")

    ...