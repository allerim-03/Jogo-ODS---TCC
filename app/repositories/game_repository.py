"""
===========================================================================
GAME REPOSITORY

Responsável exclusivamente pelo acesso ao banco de dados referente aos jogos.

NÃO possui regras de negócio.

Responsabilidades:

- buscar jogo por ID;
- listar jogos disponíveis;
- fornecer informações do catálogo de jogos.
===========================================================================
"""

from database.connection import get_connection


class GameRepository:

    # ==========================================================================
    # BUSCAR JOGO POR ID
    # ==========================================================================

    def get_game_by_id(self, game_id):
        """
        Busca um jogo pelo ID.
        """

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT *
            FROM game
            WHERE id = %s
            """,
            (game_id,)
        )

        game = cursor.fetchone()

        cursor.close()
        conn.close()

        return game


    # ==========================================================================
    # LISTAR TODOS OS JOGOS
    # ==========================================================================

    def get_all_games(self):
        """
        Lista todos os jogos cadastrados.
        """

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            """
            SELECT *
            FROM game
            ORDER BY name_game
            """
        )

        games = cursor.fetchall()

        cursor.close()
        conn.close()

        return games


# ==========================================================================
# INSTÂNCIA DO REPOSITORY
# ==========================================================================

game_repository = GameRepository()


# ==========================================================================
# COMPATIBILIDADE / ACESSO
# ==========================================================================

def get_game_by_id(game_id):
    return game_repository.get_game_by_id(game_id)


def get_all_games():
    return game_repository.get_all_games()