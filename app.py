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

# Página Inicial (Landing page / Entrada)
@app.route("/")
def index():
    return render_template("index.html")

# Home / Dashboard principal
@app.route("/home")
def pagina_home():
    return render_template("home.html")

# Telas de Escolha
@app.route("/escolha")
def pagina_escolha():
    return render_template("escolha.html")

@app.route("/escolha-cadastro")
def pagina_escolha_cadastro():
    return render_template("escolha-cadastro.html")

# Telas de Aluno
@app.route("/login-page")
def pagina_login():
    return render_template("login.html")

@app.route("/cadastro-page")
def pagina_cadastro():
    return render_template("cadastro.html")

@app.route("/perfil")
def pagina_perfil():
    return render_template("perfil.html")

@app.route("/editar-perfil")
def pagina_editar_perfil():
    return render_template("editar-perfil.html")

# Telas de Professor
@app.route("/login-professor")
def pagina_login_professor():
    return render_template("login-professor.html")

@app.route("/cadastro-professor")
def pagina_cadastro_professor():
    return render_template("cadastro-professor.html")

@app.route("/perfil-professor")
def pagina_perfil_professor():
    return render_template("perfil-professor.html")

@app.route("/classroom")
def pagina_classroom():
    return render_template("classroom.html")

@app.route("/create-classroom")
def pagina_create_classroom():
    return render_template("create_classroom.html")

# Conteúdos, Jogos e Quiz
@app.route("/jogos")
def pagina_jogos():
    return render_template("jogos.html")

@app.route("/jogo1-page")
def pagina_jogo1():
    return render_template("jogo1.html")

@app.route("/ods")
def pagina_ods():
    return render_template("ods.html")

@app.route("/quiz")
def pagina_quiz():
    return render_template("quiz.html")

@app.route("/ranking")
def pagina_ranking():
    return render_template("ranking.html")

@app.route("/sobrenos")
def pagina_sobrenos():
    return render_template("sobrenos.html")

@app.route("/token")
def pagina_token():
    return render_template("token.html")


# Tratamento para erro 404 (Página não encontrada)
@app.errorhandler(404)
def pagina_nao_encontrada(e):
    return render_template("erro404.html"), 404


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


# Listar todos os usuários
@app.route("/usuarios", methods=["GET"])
def listar_usuarios():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM usuarios")
    resultado = cursor.fetchall()
    cursor.close()
    return jsonify(resultado)


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