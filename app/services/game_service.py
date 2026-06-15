#converte score em xp
#aplica progresso (xp+ badge)
from app.services.xp_service import add_xp
from app.services.badge_service import check_and_award_badges

from app.repositories.user_repository import (
    get_user_by_id,
    update_user
)
from app.repositories.score_repository import save_score



def process_game_score(user_id, score):

    user = get_user_by_id(user_id)
    xp_before = user["xp"]
    xp_gained = score * 10

    user = add_xp(
        user,
        xp_gained
    )

    update_user(user)

    check_and_award_badges(
        user["id"],
        user["xp"],
        user["level"]
    )
    save_score(
    user["id"],
    "quiz_ods",
    score,
    xp_gained
)
    return user, xp_gained, xp_before