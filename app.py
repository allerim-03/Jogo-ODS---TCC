from flask import Flask, request, jsonify, render_template
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from models.usuario import Usuario
import mysql.connector

app = Flask(__name__)

# Configuração do banco MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="senha123",
    database="tcc"
)

# Inicializar extensões
bcrypt = Bcrypt(app)
CORS(app)


# ==========================================
# ROTAS PARA ABRIR AS PÁGINAS (FRONTEND)
# ==========================================

# Página Inicial (http://localhost:5000/)
@app.route("/")
def index():
    return render_template("index.html")

# Página de Login (http://localhost:5000/login-page)
@app.route("/login-page")
def pagina_login():
    return render_template("login.html")

# Página de Cadastro (http://localhost:5000/cadastro-page)
@app.route("/cadastro-page")
def pagina_cadastro():
    return render_template("cadastro.html")

# Página do Jogo 1 (http://localhost:5000/jogo1-page)
@app.route("/jogo1-page")
def pagina_jogo1():
    return render_template("jogo1.html")

# (Se precisar de mais páginas, basta adicionar novas rotas render_template aqui)


# ==========================================
# ROTAS DE API (BANCO DE DADOS E LÓGICA)
# ==========================================

# Cadastro de usuário
@app.route("/cadastro", methods=["POST"])
def cadastro():
    data = request.json
    nome = data.get("nome")
    senha = data.get("senha")

    # Criptografar senha antes de salvar
    senha_hash = bcrypt.generate_password_hash(senha).decode("utf-8")

    cursor = db.cursor()
    sql = "INSERT INTO usuarios (nome, senha) VALUES (%s, %s)"
    cursor.execute(sql, (nome, senha_hash))
    db.commit()
    cursor.close()

    return jsonify({"message": "Usuário cadastrado com sucesso!"}), 201


# Login de usuário
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    nome = data.get("nome")
    senha = data.get("senha")

    cursor = db.cursor(dictionary=True)
    sql = "SELECT * FROM usuarios WHERE nome = %s"
    cursor.execute(sql, (nome,))
    usuario = cursor.fetchone()
    cursor.close()

    if usuario and bcrypt.check_password_hash(usuario["senha"], senha):
        return jsonify({"message": "Login realizado com sucesso!"})
    else:
        return jsonify({"message": "Usuário ou senha inválidos"}), 401


# Listar todos os usuários (teste)
@app.route("/usuarios", methods=["GET"])
def listar_usuarios():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios")
    resultado = cursor.fetchall()
    cursor.close()
    return jsonify(resultado)


# Adicionando o usuário integrando com a classe model
@app.route("/add_usuario", methods=["POST"])
def add_usuario():
    dados = request.json
    # Criptografa a senha antes de passar para o model
    senha_hash = bcrypt.generate_password_hash(dados["senha"]).decode("utf-8")
    usuario = Usuario(nome=dados["nome"], senha=senha_hash)

    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO usuarios (nome, senha) VALUES (%s, %s)",
        (usuario.nome, usuario.senha)
    )
    db.commit()
    cursor.close()

    return jsonify({"mensagem": "Usuário inserido com sucesso!"}), 201


# Buscador de usuário por ID
@app.route("/usuario/<int:id>", methods=["GET"])
def buscar_usuario(id):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios WHERE id = %s", (id,))
    resultado = cursor.fetchone()
    cursor.close()

    if not resultado:
        return jsonify({"erro": "Usuário não encontrado"}), 404

    return jsonify(resultado)


if __name__ == "__main__":
    app.run(debug=True)