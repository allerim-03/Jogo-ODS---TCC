from database.connection import get_connection

# verifica badge
# dá badge
class BadgeService:
    def check_and_award_badges(self,user_id, xp, level):

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        # pega todas as badges
        cursor.execute("SELECT * FROM badge")
        badge = cursor.fetchall()

        for badge in badge:

            already_has = user_has_badge(
                user_id,
                badge["id"],
                cursor
            )

            if already_has:
                continue

            if (
                badge["requirement_type"] == "xp"
                and xp >= badge["requirement_value"]
            ):
                award_badge(
                    user_id,
                    badge["id"],
                    cursor
                )

            if (
                badge["requirement_type"] == "level"
                and level >= badge["requirement_value"]
            ):
                award_badge(
                    user_id,
                    badge["id"],
                    cursor
                )

        conn.commit()

        cursor.close()
        conn.close()


    def user_has_badge(self,user_id, badge_id, cursor):

        cursor.execute("""
            SELECT id
            FROM inventory_badge
            WHERE user_id = %s
            AND badge_id = %s
        """, (user_id, badge_id))

        return cursor.fetchone() is not None


    def award_badge(self,user_id, badge_id, cursor):

        cursor.execute("""
            INSERT INTO inventory_badge
            (user_id, badge_id)
            VALUES (%s, %s)
        """, (user_id, badge_id))

# =====================================================
# COMPATIBILIDADE TEMPORÁRIA
# Mantém serviços antigos funcionando durante migração
# =====================================================

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