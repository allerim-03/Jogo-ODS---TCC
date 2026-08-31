"""
===========================================================================
SCORE REPOSITORY

Responsável exclusivamente pelo acesso ao banco de dados referente
às pontuações dos jogos.

NÃO possui regras de negócio.

Responsabilidades:
- salvar pontuação;
- buscar histórico;
- buscar jogos recentes;
- obter estatísticas.
===========================================================================
"""

from database.connection import get_connection


class ScoreRepository:

    # ======================================================================
    # SALVAR PONTUAÇÃO
    # ======================================================================

    def save_game_score(
        self,
        user_id,
        game_id,
        score,
        xp_gained
    ):
        """
        Salva o resultado de uma partida na tabela score.
        """

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO score
            (
                user_id,
                game_id,
                points,
                xp_earned
            )
            VALUES (%s, %s, %s, %s)
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


    # ======================================================================
    # HISTÓRICO DE PARTIDAS
    # ======================================================================

    def get_user_game_history(
        self,
        user_id
    ):
        """
        Retorna o histórico de partidas do usuário.
        """

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                s.id,
                s.game_id,
                g.name_game,
                s.points,
                s.xp_earned,
                s.played_at
            FROM score s
            INNER JOIN game g
                ON s.game_id = g.id
            WHERE s.user_id = %s
            ORDER BY s.played_at DESC
            """,
            (user_id,)
        )

        history = cursor.fetchall()

        cursor.close()
        conn.close()

        return history


    # ======================================================================
    # JOGOS RECENTES
    # ======================================================================

    def get_recent_games(
        self,
        user_id,
        limit=5
    ):
        """
        Retorna os últimos jogos realizados pelo usuário.
        """

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                s.game_id,
                g.name_game,
                s.points,
                s.xp_earned,
                s.played_at
            FROM score s
            INNER JOIN game g
                ON s.game_id = g.id
            WHERE s.user_id = %s
            ORDER BY s.played_at DESC
            LIMIT %s
            """,
            (
                user_id,
                limit
            )
        )

        games = cursor.fetchall()

        cursor.close()
        conn.close()

        return games


    # ======================================================================
    # ESTATÍSTICAS
    # ======================================================================

    def get_user_game_statistics(
        self,
        user_id
    ):
        """
        Retorna estatísticas gerais dos jogos realizados pelo usuário.
        """

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT
                COUNT(*) AS matches,
                COALESCE(SUM(points), 0) AS total_score,
                COALESCE(SUM(xp_earned), 0) AS total_xp,
                COALESCE(AVG(points), 0) AS average_score,
                COALESCE(MAX(points), 0) AS best_score
            FROM score
            WHERE user_id = %s
            """,
            (user_id,)
        )

        stats = cursor.fetchone()

        cursor.close()
        conn.close()

        return stats


# ==========================================================================
# INSTÂNCIA DO REPOSITORY
# ==========================================================================

score_repository = ScoreRepository()
