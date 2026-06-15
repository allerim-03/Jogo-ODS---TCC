#converte score em xp
#aplica progresso (xp+ badge)
from app.services.xp_service import add_xp
from app.services.badge_service import check_and_award_badges




def process_game_score(user, score):
    xp_gained = score * 10

    user = add_xp(user, xp_gained)

    check_and_award_badges(
        user["id"],
        user["xp"],
        user["level"]
    )

    return user, xp_gained