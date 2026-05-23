import os

# Instalar o Driver do MySQL para Python: "pip install pymysql"

class Config:
    # ==========================================================================
    #   CONFIGURAÇÕES FUNCIONAIS (NÃO ALTERAR)
    # ==========================================================================

    # Chave secreta para criptografia de sessões e cookies de segurança do Flask
    SECRET_KEY = os.environ.get("SECRET_KEY") or "super-secret-key-ods-kids"
    
    # Chave de segurança utilizada pelo JWTManager para gerar e validar os Tokens de Login
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or "jwt-secret-key-token"


    # ==========================================================================
    #   CONFIGURAÇÕES DO BANCO DE DADOS (MIGRAR PRO MYSQL)
    # ==========================================================================
    
    # TODO: ALTERAR ESTA LINHA QUANDO CONFIGURAR O BANCO DE DADOS EM PRODUÇÃO (MYSQL)
    # Atualmente configurado para rodar localmente com SQLite (Gera o arquivo 'database.db' na pasta 'instance').
    # Para migrar para o MySQL, substitua a string abaixo pelo padrão:
    # "mysql+pymysql://usuario:senha@localhost/nome_do_banco"
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.db"
    
    # Desativa o sistema de modificação de objetos do SQLAlchemy para economizar memória e evitar overhead
    SQLALCHEMY_TRACK_MODIFICATIONS = False