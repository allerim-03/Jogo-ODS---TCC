#rotas da API
from flask import Blueprint, request, jsonify
from models.usuario import Usuario
from app import db

usuario_bp = Blueprint("usuario", __name__)

@usuario_bp.route("/usuarios", methods=["GET"])
def listar_usuarios():
    usuarios = Usuario.query.all()
    return jsonify([{"id": u.id, "nome": u.nome, "pontos": u.pontos} for u in usuarios])

@usuario_bp.route("/usuarios", methods=["POST"])
def criar_usuario():
    data = request.json
    novo_usuario = Usuario(nome=data["nome"], pontos=data.get("pontos", 0))
    db.session.add(novo_usuario)
    db.session.commit()
    return jsonify({"message": "Usuário criado com sucesso!"}), 201