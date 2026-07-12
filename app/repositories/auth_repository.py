"""
===========================================================================
AUTH REPOSITORY

Responsabilidade:
- Acesso ao banco de dados para autenticação.
- Buscar usuários.
- Criar usuários.

Não contém regras de negócio.
===========================================================================
"""

from database.connection import get_connection


# ==========================================================================
# Buscar usuário por e-mail
# ==========================================================================

def get_user_by_email(email):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE email = %s
        LIMIT 1
        """,
        (email,)
    )

    user = cursor.fetchone()

    cursor.close()
    connection.close()

    return user


# ==========================================================================
# Buscar usuário por ID
# ==========================================================================

def get_user_by_id(user_id):

    connection = get_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT *
        FROM users
        WHERE id = %s
        LIMIT 1
        """,
        (user_id,)
    )

    user = cursor.fetchone()

    cursor.close()
    connection.close()

    return user


# ==========================================================================
# Criar usuário
# ==========================================================================

def create_user(user_data):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        INSERT INTO users
        (
            name,
            email,
            password,
            role,
            use_type
        )
        VALUES
        (
            %s,
            %s,
            %s,
            %s,
            %s
        )
        """,
        (
            user_data["name"],
            user_data["email"],
            user_data["password"],
            user_data["role"],
            user_data["use_type"]
        )
    )

    connection.commit()

    user_id = cursor.lastrowid

    cursor.close()
    connection.close()

    return user_id


# ==========================================================================
# Atualizar senha
# ==========================================================================

def update_password(user_id, password_hash):

    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        """
        UPDATE users
        SET password = %s
        WHERE id = %s
        """,
        (
            password_hash,
            user_id
        )
    )

    connection.commit()

    cursor.close()
    connection.close()