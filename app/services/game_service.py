# ==========================================================================
# GAME SERVICE
# Converte Score em XP e aplica o progresso do usuário
# ==========================================================================

from app.services.xp_service import add_xp
from app.services.badge_service import check_and_award_badges

from app.repositories.user_repository import UserRepository
from app.repositories.score_repository import ScoreRepository


class GameService:

    def __init__(self):

        self.user_repository = UserRepository()
        self.score_repository = ScoreRepository()


    # ======================================================================
    # PROCESSAR PONTUAÇÃO
    # ======================================================================

    def process_game_score(
        self,
        user_id,
        game_id,
        score,
        xp_gained=None
    ):

        # ------------------------------------------------------------------
        # Validação do score
        # ------------------------------------------------------------------

        if score is None:

            return {
                "status": 400,
                "body": {
                    "success": False,
                    "message": "Score is required."
                }
            }

        if score < 0:

            return {
                "status": 400,
                "body": {
                    "success": False,
                    "message": "Score cannot be negative."
                }
            }


        # ------------------------------------------------------------------
        # Busca usuário
        # ------------------------------------------------------------------

        user = self.user_repository.get_by_id(
            user_id
        )

        if user is None:

            return {
                "status": 404,
                "body": {
                    "success": False,
                    "message": "User not found."
                }
            }


        # ------------------------------------------------------------------
        # XP anterior
        # ------------------------------------------------------------------

        xp_before = user.xp


        # ------------------------------------------------------------------
        # Converte Score → XP
        # ------------------------------------------------------------------

        if xp_gained is None:

            xp_gained = score * 10


        # ------------------------------------------------------------------
        # Atualiza XP e nível
        # ------------------------------------------------------------------

        add_xp(
            user,
            xp_gained
        )

        self.user_repository.update_progress(
            user
        )


        # ------------------------------------------------------------------
        # Verifica badges
        # ------------------------------------------------------------------

        check_and_award_badges(
            user.id,
            user.xp,
            user.level
        )


        # ------------------------------------------------------------------
        # Salva histórico da partida
        # ------------------------------------------------------------------

        self.score_repository.save_game_score(
            user_id=user.id,
            game_id=game_id,
            score=score,
            xp_gained=xp_gained
        )


        # ------------------------------------------------------------------
        # Resultado
        # ------------------------------------------------------------------

        return {
            "status": 200,
            "body": {
                "success": True,
                "message": "Game score processed successfully.",
                "score": score,
                "xp_before": xp_before,
                "xp_gained": xp_gained,
                "xp": user.xp,
                "level": user.level
            }
        }


# ==========================================================================
# COMPATIBILIDADE TEMPORÁRIA
# ==========================================================================

_game_service = GameService()


def process_game_score(
    user_id,
    game_id,
    score,
    xp_gained=None
):

    return _game_service.process_game_score(
        user_id=user_id,
        game_id=game_id,
        score=score,
        xp_gained=xp_gained
    )


'''# converte score em xp
# aplica progresso (xp + badge)

from app.services.xp_service import add_xp
from app.services.badge_service import check_and_award_badges

from app.repositories.user_repository import UserRepository

user_repository = UserRepository()

from app.repositories.score_repository import save_score

class GameService:

    def process_game_score(self,
        user_id,
        score,
        xp_gained=None,
        game_name="quiz_ods"
    ):

        user = user_repository.get_by_id(user_id)
        xp_before = user.xp

        # Se não foi informado, utiliza a regra padrão (jogos)
        if xp_gained is None:
            xp_gained = score * 10

        # Atualiza XP e nível
        user = add_xp(
            user,
            xp_gained
        )

        user_repository.update(user)

        # Verifica badges
        check_and_award_badges(
            user.id,
            user.xp,
            user.level
        )

        # Salva pontuação
        save_score(
            user.id,
            game_name,
            score,
            xp_gained
        )

        return user, xp_gained, xp_before
# =====================================================
# COMPATIBILIDADE TEMPORÁRIA
# Mantém serviços antigos funcionando durante migração
# =====================================================

_game_service = GameService()


def process_game_score(
    user_id,
    score,
    xp_gained=None,
    game_name="quiz_ods"
):

    return _game_service.process_game_score(
        user_id,
        score,
        xp_gained,
        game_name
    )
'''