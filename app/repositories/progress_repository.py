
"""
===========================================================================
PROGRESS REPOSITORY

Responsabilidade:
- Consultar informações de progresso do usuário.
- Não contém regras de negócio.
- Apenas acessa o banco de dados.

Responsável pelo progresso consolidado do usuário.
===========================================================================
"""

from database.connection import get_connection


class ProgressRepository:

    # ======================================================================
    # PROGRESSO GERAL DO USUÁRIO
    # ======================================================================

    def get_user_progress(self, user_id):

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT
                id,
                name,
                xp,
                level
            FROM user_plataform
            WHERE id = %s
        """

        cursor.execute(
            query,
            (user_id,)
        )

        user = cursor.fetchone()

        cursor.close()
        connection.close()

        return user


    # ======================================================================
    # HISTÓRICO DE XP
    # ======================================================================

    def get_xp_history(self, user_id):

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT
                xp_before,
                xp_gained,
                xp_after,
                source,
                created_at
            FROM xp_history
            WHERE user_id = %s
            ORDER BY created_at DESC
        """

        cursor.execute(
            query,
            (user_id,)
        )

        history = cursor.fetchall()

        cursor.close()
        connection.close()

        return history


    # ======================================================================
    # ESTATÍSTICAS
    # ======================================================================

    def get_statistics(self, user_id):

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT

                (
                    SELECT COUNT(*)
                    FROM score
                    WHERE user_id = %s
                ) AS games_completed,

                (
                    SELECT COUNT(*)
                    FROM quiz_attempt
                    WHERE user_id = %s
                ) AS quizzes_completed,

                (
                    SELECT COUNT(*)
                    FROM inventory_badge
                    WHERE user_id = %s
                ) AS badges,

                (
                    SELECT xp
                    FROM user_plataform
                    WHERE id = %s
                ) AS total_xp,

                (
                    SELECT level
                    FROM user_plataform
                    WHERE id = %s
                ) AS current_level

        """

        cursor.execute(
            query,
            (
                user_id,
                user_id,
                user_id,
                user_id,
                user_id
            )
        )

        statistics = cursor.fetchone()

        cursor.close()
        connection.close()

        return statistics


# ==========================================================================
# INSTÂNCIA DO REPOSITORY
# ==========================================================================

_repository = ProgressRepository()


# ==========================================================================
# COMPATIBILIDADE TEMPORÁRIA
# ==========================================================================

def get_user_progress(user_id):
    return _repository.get_user_progress(user_id)


def get_xp_history(user_id):
    return _repository.get_xp_history(user_id)


def get_statistics(user_id):
    return _repository.get_statistics(user_id)
