"""
===========================================================================
GAME REPOSITORY

Responsável exclusivamente pelo acesso ao banco de dados referente aos jogos.

NÃO possui regras de negócio.

Funções previstas:
- salvar pontuação
- buscar histórico
- listar jogos
- estatísticas
===========================================================================
"""

from database.connection import get_connection


# ==========================================================================
# SCORE
# ==========================================================================

def save_game_score(user_id, game_id, score, xp_gained):
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

def get_user_game_history(user_id):
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
# GAME
# ==========================================================================

def get_game_by_id(game_id):
    """
    Busca um jogo.
    """

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT *
        FROM games
        WHERE id = %s
        """,
        (game_id,)
    )

    game = cursor.fetchone()

    cursor.close()
    conn.close()

    return game


def get_all_games():
    """
    Lista todos os jogos.
    """

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute(
        """
        SELECT *
        FROM games
        ORDER BY title
        """
    )

    games = cursor.fetchall()

    cursor.close()
    conn.close()

    return games


# ==========================================================================
# STATISTICS
# ==========================================================================

def get_user_game_statistics(user_id):
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