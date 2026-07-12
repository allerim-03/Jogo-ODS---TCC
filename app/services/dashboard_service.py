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

from app.repositories.user_repository import UserRepository
from app.repositories.progress_repository import ProgressRepository
from app.repositories.ranking_repository import RankingRepository
from app.repositories.badge_repository import BadgeRepository
from app.repositories.quiz_repository import QuizRepository
from app.repositories.game_repository import GameRepository

user_repository = UserRepository()
progress_repository = ProgressRepository()
ranking_repository = RankingRepository()
badge_repository = BadgeRepository()
quiz_repository = QuizRepository()
game_repository = GameRepository()


class DashboardService:

    # ==========================================================
    # Dashboard do estudante
    # ==========================================================

    def student_dashboard(self, user_id):

        user = UserRepository.get_user_by_id(user_id)
        progress = ProgressRepository.get_user_progress(user_id)
        ranking = RankingRepository.get_user_ranking(user_id)
        badges = BadgeRepository.get_user_badges(user_id)
        quizzes = QuizRepository.get_recent_quizzes(user_id)
        games = GameRepository.get_recent_games(user_id)

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

        progress = ProgressRepository.get_user_progress(user_id)

        return {
            "xp": progress["xp"],
            "level": progress["level"],
            "completed_games": progress["games"],
            "completed_quizzes": progress["quizzes"],
            "badges": progress["badges"]
        }