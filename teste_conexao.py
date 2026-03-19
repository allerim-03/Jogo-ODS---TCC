import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",          # usuário correto
    password="senha123",  # senha que você definiu
    database="tcc"        # nome do banco
)

print("Conexão realizada com sucesso!")
