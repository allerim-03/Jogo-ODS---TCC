"""
===========================================================================
PROGRESS REPOSITORY

Responsabilidade:
- Consultar informações de progresso do usuário.
- Não contém regras de negócio.
- Apenas acessa o banco de dados.
===========================================================================
"""

from database.connection import get_connection


class ProgressRepository:

    # ======================================================================
    # Progresso geral do usuário
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
            FROM user
            WHERE id = %s
        """

        cursor.execute(query, (user_id,))
        user = cursor.fetchone()

        cursor.close()
        connection.close()

        return user

    # ======================================================================
    # Histórico de XP
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

        cursor.execute(query, (user_id,))
        history = cursor.fetchall()

        cursor.close()
        connection.close()

        return history

    # ======================================================================
    # Estatísticas
    # ======================================================================

    def get_statistics(self, user_id):

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT
                games_completed,
                quizzes_completed,
                total_xp,
                current_level
            FROM user_statistics
            WHERE user_id = %s
        """

        cursor.execute(query, (user_id,))
        statistics = cursor.fetchone()

        cursor.close()
        connection.close()

        return statistics


# =====================================================
# COMPATIBILIDADE TEMPORÁRIA
# =====================================================

_repository = ProgressRepository()


def get_user_progress(user_id):
    return _repository.get_user_progress(user_id)


def get_xp_history(user_id):
    return _repository.get_xp_history(user_id)


def get_statistics(user_id):
    return _repository.get_statistics(user_id)