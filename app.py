from flask import Flask, request, jsonify, render_template
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)

# Configuração do banco MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="nicoly123",
    database="tcc"
)

# Inicializar extensões
bcrypt = Bcrypt(app)
CORS(app)


# ==========================================
# ROTAS PARA ABRIR AS PÁGINAS (FRONTEND)
# ==========================================

# Página Inicial
@app.route("/")
def index():
    return render_template("index.html")

# Página de Login
@app.route("/login-page")
def pagina_login():
    return render_template("login.html")

# Página de Cadastro
@app.route("/cadastro-page")
def pagina_cadastro():
    return render_template("cadastro.html")

# Página do Jogo 1
@app.route("/jogo1-page")
def pagina_jogo1():
    return render_template("jogo1.html")


# ==========================================
# ROTAS DE API (BANCO DE DADOS E LÓGICA)
# ==========================================

@app.route("/cadastro", methods=["POST"])
def cadastro():
    data = request.json
    nome = data.get("nome")
    senha = data.get("senha")

    senha_hash = bcrypt.generate_password_hash(senha).decode("utf-8")

    cursor = db.cursor()
    sql = "INSERT INTO usuarios (nome, senha) VALUES (%s, %s)"
    cursor.execute(sql, (nome, senha_hash))
    db.commit()
    cursor.close()

    return jsonify({"message": "Usuário cadastrado com sucesso!"}), 201


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


@app.route("/usuarios", methods=["GET"])
def listar_usuarios():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios")
    resultado = cursor.fetchall()
    cursor.close()
    return jsonify(resultado)


if __name__ == "__main__":
    app.run(debug=True)