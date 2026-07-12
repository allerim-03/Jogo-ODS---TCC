from database.connection import get_connection


class RankingRepository:

    # =====================================================
    # Ranking geral da plataforma
    # =====================================================

    def get_ranking(self):

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                name,
                xp,
                level
            FROM user
            ORDER BY xp DESC, level DESC
        """)

        ranking = cursor.fetchall()

        cursor.close()
        conn.close()

        return ranking

    # =====================================================
    # Posição de um usuário no ranking
    # =====================================================

    def get_user_ranking(self, user_id):

        ranking = self.get_ranking()

        for position, user in enumerate(ranking, start=1):
            if user["id"] == user_id:

                return {
                    "position": position,
                    "user": user
                }

        return None


# =====================================================
# Compatibilidade temporária
# =====================================================

_repository = RankingRepository()


def get_ranking():
    return _repository.get_ranking()


def get_user_ranking(user_id):
    return _repository.get_user_ranking(user_id)