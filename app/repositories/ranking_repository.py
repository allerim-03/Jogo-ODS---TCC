"""
===========================================================================
RANKING REPOSITORY

Responsável exclusivamente pelo acesso ao banco de dados referente
ao ranking dos usuários.

NÃO possui regras de negócio.

Responsabilidades:
- buscar ranking geral;
- buscar posição de um usuário.
===========================================================================
"""

from database.connection import get_connection


class RankingRepository:

    # ======================================================================
    # RANKING GERAL
    # ======================================================================

    def get_global_ranking(self):

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
            WHERE is_active = TRUE
            ORDER BY xp DESC, level DESC, id ASC
            """
        )

        ranking = cursor.fetchall()

        cursor.close()
        conn.close()

        return ranking


    # ======================================================================
    # POSIÇÃO DO USUÁRIO
    # ======================================================================

    def get_user_ranking(self, user_id):

        ranking = self.get_global_ranking()

        for position, user in enumerate(ranking, start=1):

            if user["id"] == user_id:

                return {
                    "position": position,
                    "user": user
                }

        return None


# ==========================================================================
# INSTÂNCIA DO REPOSITORY
# ==========================================================================

ranking_repository = RankingRepository()


# ==========================================================================
# COMPATIBILIDADE
# ==========================================================================

def get_global_ranking():

    return ranking_repository.get_global_ranking()


def get_user_ranking(user_id):

    return ranking_repository.get_user_ranking(user_id)