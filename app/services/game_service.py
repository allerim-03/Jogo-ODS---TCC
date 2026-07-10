# converte score em xp
# aplica progresso (xp + badge)

from app.services.xp_service import add_xp
from app.services.badge_service import check_and_award_badges

from app.repositories.user_repository import UserRepository

user_repository = UserRepository()

from app.repositories.score_repository import save_score


def process_game_score(
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