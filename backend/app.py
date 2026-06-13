from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

# Inicializamos as extensões globais fora da fábrica para evitar importação circular
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Carrega as variáveis de ambiente e chaves definidas no arquivo config.py
    app.config.from_object(Config)

    # Ativa as extensões vinculando-as à instância do Flask
    db.init_app(app)
    jwt.init_app(app)
    
    # Permite que o Frontend (Vue) faça requisições para o Backend (Flask) sem bloqueios de segurança do navegador
    CORS(app) 

    # Importa e registra o conjunto de rotas de autenticação (Login e Cadastro)
    from routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)

    # ==========================================================================
    # ATENÇÃO: BLOCO DO BANCO DE DADOS (CRÍTICO PARA MYSQL)
    # ==========================================================================
    with app.app_context():
        # O comando db.create_all() cria automaticamente as tabelas baseadas nos models.
        # NOTA PARA O MYSQL: No SQLite, o arquivo do banco é gerado do zero sozinho. 
        # No MySQL, o banco de dados (Schema) PRECISA JÁ EXISTIR criado no seu gerenciador 
        # (ex: MySQL Workbench, phpMyAdmin) antes de rodar o comando abaixo, caso contrário dará erro de conexão.
        db.create_all()

    return app

# Cria a instância global que o servidor utilizará para rodar
app = create_app()

# Inicia o servidor local na porta 5000 com o modo de depuração (debug) ativo
if __name__ == "__main__":
    app.run(debug=True, port=5000)