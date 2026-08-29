from database.connection import get_connection


# ==========================================================================
# BADGE SERVICE
# Verifica e concede badges aos usuários
# ==========================================================================

class BadgeService:

    # ======================================================================
    # VERIFICAR E CONCEDER BADGES
    # ======================================================================

    def check_and_award_badges(
        self,
        user_id,
        xp,
        level
    ):

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        try:

            # ------------------------------------------------------------------
            # Busca todas as badges
            # ------------------------------------------------------------------

            cursor.execute(
                "SELECT * FROM badge"
            )

            badges = cursor.fetchall()


            # ------------------------------------------------------------------
            # Verifica cada badge
            # ------------------------------------------------------------------

            for badge in badges:

                already_has = self.user_has_badge(
                    user_id,
                    badge["id"],
                    cursor
                )

                if already_has:
                    continue


                # --------------------------------------------------------------
                # Badge por XP
                # --------------------------------------------------------------

                if (
                    badge["requirement_type"] == "xp"
                    and xp >= badge["requirement_value"]
                ):

                    self.award_badge(
                        user_id,
                        badge["id"],
                        cursor
                    )


                # --------------------------------------------------------------
                # Badge por nível
                # --------------------------------------------------------------

                elif (
                    badge["requirement_type"] == "level"
                    and level >= badge["requirement_value"]
                ):

                    self.award_badge(
                        user_id,
                        badge["id"],
                        cursor
                    )


            # ------------------------------------------------------------------
            # Confirma alterações
            # ------------------------------------------------------------------

            conn.commit()


        except Exception:

            conn.rollback()

            raise


        finally:

            cursor.close()
            conn.close()


    # ======================================================================
    # VERIFICAR SE USUÁRIO JÁ POSSUI BADGE
    # ======================================================================

    def user_has_badge(
        self,
        user_id,
        badge_id,
        cursor
    ):

        cursor.execute("""
            SELECT id
            FROM inventory_badge
            WHERE user_id = %s
            AND badge_id = %s
        """, (
            user_id,
            badge_id
        ))

        return cursor.fetchone() is not None


    # ======================================================================
    # CONCEDER BADGE
    # ======================================================================

    def award_badge(
        self,
        user_id,
        badge_id,
        cursor
    ):

        cursor.execute("""
            INSERT INTO inventory_badge
            (user_id, badge_id)
            VALUES (%s, %s)
        """, (
            user_id,
            badge_id
        ))


# ==========================================================================
# COMPATIBILIDADE TEMPORÁRIA
# Mantém serviços antigos funcionando durante migração
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