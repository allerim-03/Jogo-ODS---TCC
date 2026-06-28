from database.connection import get_connection


def get_user_badges(user_id):

    conn = get_connection()

    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT b.id,
               b.name,
               b.description
        FROM inventory_badge ib
        INNER JOIN badge b
            ON ib.badge_id = b.id
        WHERE ib.user_id = %s
    """, (user_id,))

    badge = cursor.fetchall()

    cursor.close()
    conn.close()

    return badge