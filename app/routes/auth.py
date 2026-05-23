from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

from app import db
from app.models.user import User


# Inicializa o Blueprint das rotas de autenticação
auth_bp = Blueprint("auth", __name__)

# ==========================================================================
# ROTA: Cadastro de Usuários (Unificado e Limpo)
# ==========================================================================
@auth_bp.route('/api/cadastro', methods=['POST'])
def cadastro():
    data = request.get_json()
    
    nome = data.get('nome')
    email = data.get('email')
    senha = data.get('senha')
    uso = data.get('uso')        # 'pessoal' ou 'institucional'
    perfil = data.get('perfil')  # 'pessoal', 'aluno' ou 'professor'

    # 1. Validação simples
    if not nome or not email or not senha:
        return jsonify({"success": False, "message": "Todos os campos devem ser preenchidos!"}), 400

    # 2. Verifica se o e-mail já existe no banco de dados
    email_existente = User.query.filter_by(email=email).first()
    if email_existente:
        return jsonify({"success": False, "message": "Este e-mail já está cadastrado!"}), 400

    # 3. Criptografa a senha do usuário normalmente
    senha_criptografada = generate_password_hash(senha)

    # 4. Cria a instância do novo usuário
    novo_usuario = User(
        nome=nome,
        email=email,
        senha=senha_criptografada,
        role=perfil
    )

    try:
        # 5. Salva no banco de dados
        db.session.add(novo_usuario)
        # NOTA PARA O MYSQL: No SQLite, conflitos de escrita raramente travam a sessão.
        # No MySQL, se ocorrer um erro de constraint ou timeout aqui, o commit falhará.
        # É obrigatório manter o bloco try/except com o rollback abaixo para liberar a pool de conexões do MySQL.
        db.session.commit()
        
        return jsonify({
            "success": True, 
            "message": f"Cadastro de {perfil} realizado com sucesso!"
        }), 201
        
    except Exception as e:
        # Desfaz a operação na fila caso o servidor MySQL rejeite o insert
        db.session.rollback()
        # DICA DE DEBUG: Se a migração falhar, descomente a linha abaixo para ver o erro real no console:
        # print("Erro MySQL Cadastro:", str(e))
        return jsonify({"success": False, "message": "Erro interno ao salvar no banco de dados."}), 500


# ==========================================================================
# ROTA: Login de Usuários (Unificado com JWT)
# ==========================================================================
@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    email = data.get('email')
    senha = data.get('senha')
    perfil_tela = data.get('perfil') 

    if not email or not senha:
        return jsonify({"success": False, "message": "E-mail e senha são obrigatórios!"}), 400

    # 1. Procura o usuário pelo e-mail
    user = User.query.filter_by(email=email).first()

    # Cenário A: Usuário não encontrado
    if not user:
        return jsonify({"success": False, "message": "Usuário não encontrado."}), 404

    # 2. Verifica a senha (Descriptografa o hash e compara com o texto plano)
    senha_correta = check_password_hash(user.senha, senha)
    if not senha_correta:
        return jsonify({"success": False, "message": "E-mail ou senha incorretos."}), 401

    # Cenário C: Evita que perfis errados acessem telas erradas
    if user.role != perfil_tela:
        return jsonify({
            "success": False, 
            "message": f"Esta conta está registrada como {user.role}, mas você tentou entrar como {perfil_tela}."
        }), 403

    # 3. Geração do Token JWT Seguro (Lógica idêntica para qualquer banco de dados)
    token_acesso = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role}
    )

    return jsonify({
        "success": True,
        "message": "Login efetuado com sucesso!",
        "token": token_acesso,
        "user": user.to_dict()
    }), 200