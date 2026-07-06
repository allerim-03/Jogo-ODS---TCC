# =============================================================================
# USER REPOSITORY
# =============================================================================
#
# Este módulo é responsável pelo acesso aos dados da tabela de usuários.
# Ele implementa a camada Repository da aplicação, isolando todas as consultas
# SQL do restante do sistema.
#
# Arquitetura:
#
#   Rotas (auth_routes.py)
#           │
#           ▼
#   Serviços (auth_service.py)
#           │
#           ▼
#   Repository (user_repository.py)
#           │
#           ▼
#   Banco de Dados MySQL
#
# O Repository NÃO contém regras de negócio. Sua única responsabilidade é
# executar operações no banco de dados, como:
#
#   • buscar usuários por e-mail;
#   • cadastrar novos usuários;
#   • atualizar informações;
#   • consultar progresso;
#   • consultar ranking.
#
# Conexão com o banco
# -------------------
# Todas as funções utilizam a função get_connection(), definida em
# database/connection.py.
#
# Essa função cria uma conexão com o MySQL utilizando mysql.connector e
# retorna um objeto de conexão. Cada operação do repository segue o fluxo:
#
#   1. abre a conexão;
#   2. cria um cursor;
#   3. executa a consulta SQL;
#   4. obtém os resultados (quando necessário);
#   5. confirma a transação (INSERT/UPDATE);
#   6. fecha o cursor;
#   7. fecha a conexão.
#
# Dessa forma, a camada de serviços não precisa conhecer comandos SQL nem
# detalhes da conexão com o banco, mantendo a aplicação organizada e de
# fácil manutenção.
# =============================================================================


from database.connection import get_connection



def buscar_por_email(email):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM user WHERE email = %s",
        (email,)
    )

    usuario = cursor.fetchone()

    cursor.close()
    conn.close()

    return usuario

def salvar(nome, email, senha, role):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO user
        (name, email, senha, role)
        VALUES (%s,%s,%s,%s)
    """, (nome, email, senha, role))

    conn.commit()

    cursor.close()
    conn.close()

def get_user_by_id(user_id):

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        "SELECT * FROM user WHERE id = %s",
        (user_id,)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    return user

def update_user(user):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE user
        SET xp = %s, level = %s
        WHERE id = %s
    """, (user["xp"], user["level"], user["id"]))

    conn.commit()

    cursor.close()
    conn.close()

def get_user_progress(user_id):

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            name,
            xp,
            level
        FROM user
        WHERE id = %s
    """, (user_id,))

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    return user

def get_ranking():

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    
    cursor.execute("""
    SELECT
        id,
        name,
        xp,
        level
    FROM user
    ORDER BY xp DESC
    """)

    ranking = cursor.fetchall()

    cursor.close()
    conn.close()

    return ranking