
from werkzeug.security import generate_password_hash

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
