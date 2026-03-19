
from flask import Flask, request, jsonify
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

# Rota inicial (teste)
@app.route("/")
def home():
    return "API Flask conectada com MySQL 🚀"

# Exemplo de rota de cadastro de usuário
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

    return jsonify({"message": "Usuário cadastrado com sucesso!"}), 201

# Exemplo de rota de login
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    nome = data.get("nome")
    senha = data.get("senha")

    cursor = db.cursor(dictionary=True)
    sql = "SELECT * FROM usuarios WHERE nome = %s"
    cursor.execute(sql, (nome,))
    usuario = cursor.fetchone()

    if usuario and bcrypt.check_password_hash(usuario["senha"], senha):
        return jsonify({"message": "Login realizado com sucesso!"})
    else:
        return jsonify({"message": "Usuário ou senha inválidos"}), 401


#teste de usuario 
@app.route("/usuarios", methods=["GET"])
def listar_usuarios():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios")
    resultado = cursor.fetchall()
    cursor.close()
    return jsonify(resultado)


#adicionando o usuario intregrando com a classe model
@app.route("/add_usuario", methods=["POST"])
def add_usuario():
    dados = request.json
    usuario = Usuario(nome=dados["nome"], senha=dados["senha"])

    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO usuarios (nome, senha) VALUES (%s, %s)",
        (usuario.nome, usuario.senha)
    )
    db.commit()
    cursor.close()

    return jsonify({"mensagem": "Usuário inserido com sucesso!"})
'''
-verão anterio sem incluir classe model
#adicionando usuario
@app.route("/add_usuario", methods=["POST"])
def add_usuario():
    dados = request.json
    nome = dados["nome"]
    senha = dados["senha"]

    cursor = db.cursor()
    cursor.execute("INSERT INTO usuarios (nome, senha) VALUES (%s, %s)", (nome, senha))
    db.commit()
    cursor.close()

    return jsonify({"mensagem": "Usuário inserido com sucesso!"})

'''
# buscador de usuario 
@app.route("/usuario/<int:id>", methods=["GET"])
def buscar_usuario(id):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios WHERE id = %s", (id,))
    resultado = cursor.fetchone()
    cursor.close()
    return jsonify(resultado)

if __name__ == "__main__":
    app.run(debug=True)