"""
===========================================================================
DASHBOARD SERVICE

Responsabilidade:
- Centralizar todos os dados do Dashboard.
- Dashboard do estudante.
- Dashboard do gestor.
- Estatísticas gerais.

As consultas ao banco ficam nos repositories.
===========================================================================
"""

from app.repositories.user_repository import (
    get_user_by_id
)

from app.repositories.progress_repository import (
    get_user_progress
)

from app.repositories.ranking_repository import (
    get_user_ranking
)

from app.repositories.badge_repository import (
    get_user_badges
)

from app.repositories.quiz_repository import (
    get_recent_quizzes
)

from app.repositories.game_repository import (
    get_recent_games
)


class DashboardService:

    # ==========================================================
    # Dashboard do estudante
    # ==========================================================

    def student_dashboard(self, user_id):

        user = get_user_by_id(user_id)
        progress = get_user_progress(user_id)
        ranking = get_user_ranking(user_id)
        badges = get_user_badges(user_id)
        quizzes = get_recent_quizzes(user_id)
        games = get_recent_games(user_id)

        return {
            "user": user,
            "progress": progress,
            "ranking": ranking,
            "badges": badges,
            "recent_quizzes": quizzes,
            "recent_games": games
        }

    # ==========================================================
    # Dashboard do gestor
    # ==========================================================

    def teacher_dashboard(self, teacher_id):

        """
        Futuramente retornará:

        - turmas
        - alunos
        - quizzes criados
        - estatísticas
        """

        return {
            "teacher_id": teacher_id,
            "classrooms": [],
            "students": [],
            "statistics": {}
        }

    # ==========================================================
    # Estatísticas gerais
    # ==========================================================

    def statistics(self, user_id):

        progress = get_user_progress(user_id)

        return {
            "xp": progress["xp"],
            "level": progress["level"],
            "completed_games": progress["games"],
            "completed_quizzes": progress["quizzes"],
            "badges": progress["badges"]
        }