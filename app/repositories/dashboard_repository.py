"""
===========================================================================
Dashboard Repository

Responsabilidade:
- Consultar informações do dashboard no banco.
- Não possui regras de negócio.
===========================================================================
"""

from database.connection import get_connection

class DashboardRepository:
    # ==========================================================================
    # Resumo do aluno
    # ==========================================================================

    def get_student_dashboard(self,user_id):
        """
        Retorna as informações principais do dashboard do estudante.
        """

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                name,
                xp,
                level
            FROM users
            WHERE id = %s
        """, (user_id,))

        user = cursor.fetchone()

        cursor.close()
        connection.close()

        return user


    # ==========================================================================
    # Estatísticas gerais
    # ==========================================================================

    def get_student_statistics(self,user_id):
        """
        Retorna estatísticas do estudante.
        """

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                COUNT(*) AS quizzes_completed
            FROM quiz_attempts
            WHERE user_id = %s
        """, (user_id,))

        stats = cursor.fetchone()

        cursor.close()
        connection.close()

        return stats


    # ==========================================================================
    # Jogos concluídos
    # ==========================================================================

    def get_completed_games(self,user_id):

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                COUNT(*) AS games_completed
            FROM game_scores
            WHERE user_id = %s
        """, (user_id,))

        result = cursor.fetchone()

        cursor.close()
        connection.close()

        return result


    # ==========================================================================
    # Últimas atividades
    # ==========================================================================

    def get_recent_activity(self,user_id):

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                game_name,
                score,
                xp_earned,
                played_at
            FROM game_scores
            WHERE user_id = %s
            ORDER BY played_at DESC
            LIMIT 10
        """, (user_id,))

        activities = cursor.fetchall()

        cursor.close()
        connection.close()

        return activities

'''
melhorias futuras:

dashboard_repository.py

get_student_dashboard()

get_teacher_dashboard()

get_dashboard_statistics()

get_recent_activity()

get_completed_games()

get_completed_quizzes()

get_total_xp()

get_level_progress()

get_badges()

get_next_level()

get_weekly_progress()

get_monthly_progress()

'''