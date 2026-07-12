"""
===========================================================================
GAME REPOSITORY

Responsável exclusivamente pelo acesso ao banco de dados referente aos jogos.

NÃO possui regras de negócio.

Funções previstas:

- listar jogos
informações dos jogos (catálogo)
dados dos jogos (nome, descrição, fase, ativo, etc.)
===========================================================================
"""

from database.connection import get_connection

class GameRepository:
   
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
    #istar todos os jogos
    
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

_repository = GameRepository()


def save_game_score(user_id, game_id, score, xp_gained):
    return _repository.save_game_score(
        user_id,
        game_id,
        score,
        xp_gained
    )


def get_user_game_history(user_id):
    return _repository.get_user_game_history(user_id)


def get_recent_games(user_id):
    return _repository.get_recent_games(user_id)


def get_game_by_id(game_id):
    return _repository.get_game_by_id(game_id)


def get_all_games():
    return _repository.get_all_games()


def get_user_game_statistics(user_id):
    return _repository.get_user_game_statistics(user_id)