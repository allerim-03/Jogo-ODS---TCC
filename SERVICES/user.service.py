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
    id_role,
    tipo_usuario
):
    connection = None
    cursor = None

    try:
        connection = get_connection()
        connection.start_transaction()

        cursor = connection.cursor()

        # 1. Insere os dados gerais do usuário
        sql_usuario = """
            INSERT INTO user_platform (
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

        senha_hash = generate_password_hash(password_user)

        valores_usuario = (
            name_user,
            birth_user,
            registration_user or None,
            main_email,
            personal_email or None,
            senha_hash,
            id_gender or None,
            id_role
        )

        cursor.execute(sql_usuario, valores_usuario)

        # 2. Recupera o ID gerado pelo MySQL
        id_user = cursor.lastrowid

        # 3. Insere o usuário na tabela especializada
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

        else:
            raise ValueError("Tipo de usuário inválido.")

        # 4. Confirma todas as inserções
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