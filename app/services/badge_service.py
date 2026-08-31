
"""
===========================================================================
BADGE SERVICE

Responsável pelas regras de negócio relacionadas às badges.

Responsabilidades:

- verificar requisitos das badges;
- verificar se o usuário já possui uma badge;
- conceder badges;
- consultar badges do usuário;
- consultar badges disponíveis.

O acesso ao banco de dados é realizado pelo BadgeRepository.
===========================================================================
"""

from app.repositories.badge_repository import BadgeRepository


class BadgeService:

    def __init__(self):

        self.badge_repository = BadgeRepository()


    # ======================================================================
    # VERIFICAR E CONCEDER BADGES
    # ======================================================================

    def check_and_award_badges(
        self,
        user_id,
        xp,
        level
    ):
        """
        Verifica todas as badges disponíveis e concede
        aquelas cujos requisitos foram atingidos.
        """

        badges = self.badge_repository.get_all_badges()

        awarded_badges = []

        for badge in badges:

            # --------------------------------------------------------------
            # Verifica se o usuário já possui a badge
            # --------------------------------------------------------------

            already_has = self.badge_repository.user_has_badge(
                user_id,
                badge["id"]
            )

            if already_has:
                continue


            # --------------------------------------------------------------
            # Verifica requisito de XP
            # --------------------------------------------------------------

            requirement_met = False

            if (
                badge["requirement_type"] == "xp"
                and xp >= badge["requirement_value"]
            ):

                requirement_met = True


            # --------------------------------------------------------------
            # Verifica requisito de nível
            # --------------------------------------------------------------

            elif (
                badge["requirement_type"] == "level"
                and level >= badge["requirement_value"]
            ):

                requirement_met = True


            # --------------------------------------------------------------
            # Concede a badge
            # --------------------------------------------------------------

            if requirement_met:

                self.badge_repository.award_badge(
                    user_id,
                    badge["id"]
                )

                awarded_badges.append({
                    "id": badge["id"],
                    "name": badge["name"],
                    "description": badge["description"]
                })


        return awarded_badges


    # ======================================================================
    # BADGES DO USUÁRIO
    # ======================================================================

    def get_user_badges(
        self,
        user_id
    ):
        """
        Retorna as badges conquistadas pelo usuário.
        """

        return self.badge_repository.get_user_badges(
            user_id
        )


    # ======================================================================
    # TODAS AS BADGES
    # ======================================================================

    def get_all_badges(self):
        """
        Retorna todas as badges cadastradas na plataforma.
        """

        return self.badge_repository.get_all_badges()


    # ======================================================================
    # BUSCAR BADGE POR ID
    # ======================================================================

    def get_badge_by_id(
        self,
        badge_id
    ):
        """
        Retorna uma badge específica.
        """

        return self.badge_repository.get_badge_by_id(
            badge_id
        )


# ==========================================================================
# COMPATIBILIDADE TEMPORÁRIA
# ==========================================================================

_badge_service = BadgeService()


def check_and_award_badges(
    user_id,
    xp,
    level
):

    return _badge_service.check_and_award_badges(
        user_id,
        xp,
        level
    )

