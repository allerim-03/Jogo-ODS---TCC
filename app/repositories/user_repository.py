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
#   • consultar progresso; (progress_repository)
#   • consultar ranking.(ranking_repository)
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

#acesso ao banco de dados.
# =============================================================================
## TO-DO renomear para user_plataform

from database.connection import get_connection
from app.models.user import User


class UserRepository:

    # =====================================================
    # BUSCAR USUÁRIO POR E-MAIL
    # =====================================================

    def get_by_email(self, email):

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT *
            FROM user_plataform
            WHERE email = %s
            """,
            (email,)
        )

        data = cursor.fetchone()

        cursor.close()
        conn.close()

        if data:
            return User.from_dict(data)

        return None


    # =====================================================
    # CRIAR USUÁRIO
    # =====================================================

    def create(self, user):

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO user_plataform
            (
                name,
                email,
                password,
                role,
                use_type,
                age,
                institution,
                avatar,
                xp,
                level,
                is_active
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                user.name,
                user.email,
                user.password,
                user.role,
                user.use_type,
                user.age,
                user.institution,
                user.avatar,
                user.xp,
                user.level,
                user.is_active
            )
        )

        conn.commit()

        user.id = cursor.lastrowid

        cursor.close()
        conn.close()

        return user


    # =====================================================
    # BUSCAR USUÁRIO POR ID
    # =====================================================

    def get_by_id(self, user_id):

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT *
            FROM user_plataform
            WHERE id = %s
            """,
            (user_id,)
        )

        data = cursor.fetchone()

        cursor.close()
        conn.close()

        if data:
            return User.from_dict(data)

        return None


    # =====================================================
    # ATUALIZAR USUÁRIO
    # =====================================================

    def update(self, user):

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE user_plataform
            SET
                name = %s,
                email = %s,
                role = %s,
                use_type = %s,
                age = %s,
                institution = %s,
                avatar = %s,
                is_active = %s
            WHERE id = %s
            """,
            (
                user.name,
                user.email,
                user.role,
                user.use_type,
                user.age,
                user.institution,
                user.avatar,
                user.is_active,
                user.id
            )
        )

        conn.commit()

        updated = cursor.rowcount > 0

        cursor.close()
        conn.close()

        return updated


    # =====================================================
    # ATUALIZAR PROGRESSO
    # =====================================================

    def update_progress(self, user):

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            UPDATE user_plataform
            SET
                xp = %s,
                level = %s
            WHERE id = %s
            """,
            (
                user.xp,
                user.level,
                user.id
            )
        )

        conn.commit()

        cursor.close()
        conn.close()


# =========================================================
# COMPATIBILIDADE TEMPORÁRIA
# =========================================================

_repository = UserRepository()


def get_user_by_id(user_id):
    return _repository.get_by_id(user_id)


def buscar_por_email(email):
    return _repository.get_by_email(email)


def salvar(user):
    return _repository.create(user)


def update_user(user):
    return _repository.update(user)


# =========================================================
# ATUALIZAR PERFIL
# =========================================================

def update_user_profile(
    user_id,
    name=None,
    age=None,
    institution=None
):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE user_plataform
        SET
            name = COALESCE(%s, name),
            age = COALESCE(%s, age),
            institution = COALESCE(%s, institution)
        WHERE id = %s
        """,
        (
            name,
            age,
            institution,
            user_id
        )
    )

    conn.commit()

    updated = cursor.rowcount > 0

    cursor.close()
    conn.close()

    return updated


# =========================================================
# ATUALIZAR AVATAR
# =========================================================

def update_avatar(
    user_id,
    avatar
):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE user_plataform
        SET avatar = %s
        WHERE id = %s
        """,
        (
            avatar,
            user_id
        )
    )

    conn.commit()

    updated = cursor.rowcount > 0

    cursor.close()
    conn.close()

    return updated


# =========================================================
# ATUALIZAR PREFERÊNCIAS
# =========================================================

def update_preferences(
    user_id,
    preferences
):

    """
    Temporariamente mantido.

    Futuramente pode utilizar uma tabela:

    user_preferences
        id
        user_id
        preference_name
        preference_value
    """

    return True


# =========================================================
# ATUALIZAR SENHA
# =========================================================

def update_password(
    user_id,
    password_hash
):

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE user_plataform
        SET password = %s
        WHERE id = %s
        """,
        (
            password_hash,
            user_id
        )
    )

    conn.commit()

    updated = cursor.rowcount > 0

    cursor.close()
    conn.close()

    return updated


# =========================================================
# ESTATÍSTICAS DO USUÁRIO
# =========================================================

def get_user_statistics(
    user_id
):

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT
            id,
            name,
            xp,
            level
        FROM user_plataform
        WHERE id = %s
        """,
        (user_id,)
    )

    statistics = cursor.fetchone()

    cursor.close()
    conn.close()

    return statistics
'''
(função migrada para progress_repository)

    def get_progress(self, user_id):

        conn = get_connection()

        cursor = conn.cursor(dictionary=True)


        cursor.execute(
            
            SELECT
                id,
                name,
                xp,
                level
            FROM user
            WHERE id=%s
            ,
            (user_id,)
        )


        data = cursor.fetchone()


        cursor.close()
        conn.close()


        return data
    def get_ranking(self):

        conn = get_connection()

        cursor = conn.cursor(dictionary=True)


        cursor.execute(
            """
            SELECT
                id,
                name,
                xp,
                level
            FROM user
            ORDER BY xp DESC
            """
        )


        ranking = cursor.fetchall()


        cursor.close()
        conn.close()


        return ranking
'''
