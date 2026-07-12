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


class AuthRepository:

    # ==========================================================================
    # Buscar usuário por e-mail
    # ==========================================================================

    def get_user_by_email(self, email):

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM user
            WHERE email = %s
            LIMIT 1
        """, (email,))

        user = cursor.fetchone()

        cursor.close()
        connection.close()

        return user


    # ==========================================================================
    # Buscar usuário por ID
    # ==========================================================================

    def get_user_by_id(self, user_id):

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT *
            FROM user
            WHERE id = %s
            LIMIT 1
        """, (user_id,))

        user = cursor.fetchone()

        cursor.close()
        connection.close()

        return user


    # ==========================================================================
    # Criar usuário
    # ==========================================================================

    def create_user(self, user_data):

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO user
            (
                name,
                email,
                password,
                role,
                use_type,
                age,
                institution
            )
            VALUES
            (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
            """ , (
                    user_data["name"],
                    user_data["email"],
                    user_data["password"],
                    user_data["role"],
                    user_data.get("use_type", "individual"),
                    user_data.get("age"),
                    user_data.get("institution")
                ))

        connection.commit()

        user_id = cursor.lastrowid

        cursor.close()
        connection.close()

        return user_id


    # ==========================================================================
    # Atualizar senha
    # ==========================================================================

    def update_password(self, user_id, password_hash):

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute("""
            UPDATE user
            SET password = %s
            WHERE id = %s
        """, (
            password_hash,
            user_id
        ))

        connection.commit()

        cursor.close()
        connection.close()


# =====================================================
# COMPATIBILIDADE TEMPORÁRIA
# =====================================================

_repository = AuthRepository()


def get_user_by_email(email):
    return _repository.get_user_by_email(email)


def get_user_by_id(user_id):
    return _repository.get_user_by_id(user_id)


def create_user(user_data):
    return _repository.create_user(user_data)


def update_password(user_id, password_hash):
    return _repository.update_password(user_id, password_hash)