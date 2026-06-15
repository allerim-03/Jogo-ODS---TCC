


from database.connection import get_connection
#verifica bagde
#dá badge

def check_and_award_badges(user_id, xp, level):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    # pega todas as badges
    cursor.execute("SELECT * FROM badges")
    badges = cursor.fetchall()

    for badge in badges:
         already_has = check_user_badge(
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


def user_has_badge(user_id, badge_id, cursor):
    cursor.execute("""
        SELECT id FROM inventory_badges
        WHERE user_id = %s AND badge_id = %s
    """, (user_id, badge_id))

    return cursor.fetchone() is not None


def award_badge(user_id, badge_id, cursor):
    cursor.execute("""
        INSERT INTO inventory_badges (user_id, badge_id)
        VALUES (%s, %s)
    """, (user_id, badge_id))

