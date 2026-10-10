from DATABASE.connection import get_connection

connection = None

try:
    connection = get_connection()
    print("Conexão com o MySQL realizada com sucesso!")

except Exception as erro:
    print("Falha na conexão:", erro)

finally:
    if connection is not None and connection.is_connected():
        connection.close()
        print("Conexão encerrada.")