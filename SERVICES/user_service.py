
from werkzeug.security import check_password_hash, generate_password_hash

from DATABASE.connection import get_connection


def cadastrar_usuario(
    name_user,
    birth_user,
    registration_user,
    main_email,
    personal_email,
    password_user,
    id_gender,
    tipo_usuario
):
    # O backend define a função do usuário.
    funcoes = {
        "student": 1,
        "teacher": 2
    }

    if tipo_usuario not in funcoes:
        raise ValueError("Tipo de usuário inválido.")

    id_role = funcoes[tipo_usuario]

    connection = None
    cursor = None

    try:
        connection = get_connection()
        connection.start_transaction()
        cursor = connection.cursor()

        sql_usuario = """
            INSERT INTO user_plataform (
                name_user,
                birth_user,
                registration_user,
                main_email,
                personal_email,
                password_user,
                id_gender,
                id_role
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """

        valores_usuario = (
            name_user,
            birth_user,
            registration_user or None,
            main_email,
            personal_email or None,
            generate_password_hash(password_user),
            id_gender or None,
            id_role
        )

        cursor.execute(sql_usuario, valores_usuario)

        id_user = cursor.lastrowid

        if tipo_usuario == "student":
            cursor.execute(
                """
                INSERT INTO student (id_user, code_classroom)
                VALUES (%s, NULL)
                """,
                (id_user,)
            )

        elif tipo_usuario == "teacher":
            cursor.execute(
                """
                INSERT INTO teacher (id_user)
                VALUES (%s)
                """,
                (id_user,)
            )

        connection.commit()

        return {
            "sucesso": True,
            "id_user": id_user,
            "mensagem": "Usuário cadastrado com sucesso."
        }

    except Exception:
        if connection is not None and connection.is_connected():
            connection.rollback()
        raise

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None and connection.is_connected():
            connection.close()

def autentificar_user(main_email, password_user):
    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                id_user,
                name_user,
                main_email,
                password_user,
                id_role
            FROM user_plataform
            WHERE main_email = %s
            """,
            (main_email,)
        )

        user = cursor.fetchone()

        if user is None:
            return None

        senha_armazenada = user["password_user"]

        # Compatibilidade com o professor que ainda
        # possui a senha armazenada em texto puro.
        senha_valida = (
            check_password_hash(senha_armazenada, password_user)
            if senha_armazenada.startswith(
                ("scrypt:", "pbkdf2:")
            )
            else senha_armazenada == password_user
        )

        if not senha_valida:
            return None

        # Migra a senha antiga para um hash após
        # uma autenticação bem-sucedida.
        if not senha_armazenada.startswith(
            ("scrypt:", "pbkdf2:")
        ):
            novo_hash = generate_password_hash(password_user)

            cursor.execute(
                """
                UPDATE user_plataform
                SET password_user = %s
                WHERE id_user = %s
                """,
                (novo_hash, user["id_user"])
            )

            connection.commit()

        # Não devolvemos a senha nem o hash.
        user.pop("password_user", None)

        return user

    finally:
        if cursor is not None:
            cursor.close()

        if connection is not None and connection.is_connected():
            connection.close()