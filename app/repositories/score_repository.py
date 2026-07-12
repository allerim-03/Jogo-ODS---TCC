from database.connection import get_connection
"""
===========================================================================
score REPOSITORY

Responsável exclusivamente pelo acesso ao banco de dados referente as pontuações.

NÃO possui regras de negócio.

Funções previstas:
- salvar pontuação
- buscar histórico
- estatísticas
resultados das partidas, histórico, estatísticas e últimos jogos.
===========================================================================
"""
class ScoreRepository:
    def save_score(self,
        user_id,
        game_name,
        points,
        xp_earned
    ):

        conn = get_connection()

        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO score
            (
                user_id,
                game_name,
                points,
                xp_earned
            )
            VALUES
            (%s,%s,%s,%s)
        """, (
            user_id,
            game_name,
            points,
            xp_earned
        ))

        conn.commit()

        cursor.close()
        conn.close()
    # ==========================================================================
    # SCORE
    # ==========================================================================

    def save_game_score(self,user_id, game_id, score, xp_gained):
        """
        Salva o resultado de uma partida.
        """

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO game_scores
            (
                user_id,
                game_id,
                score,
                xp_gained
            )
            VALUES (%s,%s,%s,%s)
            """,
            (
                user_id,
                game_id,
                score,
                xp_gained
            )
        )

        conn.commit()

        score_id = cursor.lastrowid

        cursor.close()
        conn.close()

        return score_id


    # ==========================================================================
    # HISTORY
    # ==========================================================================

    def get_user_game_history(self,user_id):
        """
        Histórico de partidas do usuário.
        """

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                id,
                game_id,
                score,
                xp_gained,
                played_at
            FROM game_scores
            WHERE user_id = %s
            ORDER BY played_at DESC
            """,
            (user_id,)
        )

        history = cursor.fetchall()

        cursor.close()
        conn.close()

        return history

    # ==========================================================================
    # RECENT GAMES
    # ==========================================================================

    def get_recent_games(self, user_id, limit=5):
        """
        Últimos jogos realizados pelo usuário.
        """

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                gs.game_id,
                g.title,
                gs.score,
                gs.xp_gained,
                gs.played_at
            FROM game_scores gs
            INNER JOIN games g
                ON gs.game_id = g.id
            WHERE gs.user_id = %s
            ORDER BY gs.played_at DESC
            LIMIT %s
            """,
            (user_id, limit)
        )

        games = cursor.fetchall()

        cursor.close()
        conn.close()

        return games





    # ==========================================================================
    # STATISTICS
    # ==========================================================================

    def get_user_game_statistics(self,user_id):
        """
        Estatísticas gerais do usuário.
        """

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT

                COUNT(*) AS matches,

                SUM(score) AS total_score,

                SUM(xp_gained) AS total_xp,

                AVG(score) AS average_score,

                MAX(score) AS best_score

            FROM game_scores

            WHERE user_id = %s
            """,
            (user_id,)
        )

        stats = cursor.fetchone()

        cursor.close()
        conn.close()

        return stats
    
# =====================================================
# COMPATIBILIDADE TEMPORÁRIA
# Mantém serviços antigos funcionando
# =====================================================

_repository = ScoreRepository()


def save_score(
    user_id,
    game_name,
    points,
    xp_earned
):

    return _repository.save_score(
        user_id,
        game_name,
        points,
        xp_earned
    )
