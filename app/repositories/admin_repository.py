"""
===========================================================================
Admin Repository

Responsabilidade:
- Consultas SQL utilizadas pelo painel administrativo.
- Nenhuma regra de negócio.
===========================================================================
"""

from database.connection import get_connection

class AdminRepository:
    # ==========================================================================
    # Schools
    # ==========================================================================

    def create_school(self,data):

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        query = """
            INSERT INTO schools (
                name,
                city,
                state
            )
            VALUES (%s, %s, %s)
        """

        cursor.execute(
            query,
            (
                data["name"],
                data["city"],
                data["state"]
            )
        )

        connection.commit()

        school_id = cursor.lastrowid

        cursor.close()
        connection.close()

        return school_id


    def delete_school(school_id):

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            "DELETE FROM schools WHERE id = %s",
            (school_id,)
        )

        connection.commit()

        deleted = cursor.rowcount > 0

        cursor.close()
        connection.close()

        return deleted


    # ==========================================================================
    # Users
    # ==========================================================================

    def get_all_users():

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                name,
                email,
                role,
                xp,
                level
            FROM users
            ORDER BY name
        """)

        users = cursor.fetchall()

        cursor.close()
        connection.close()

        return users


    def delete_user(self,user_id):

        connection = get_connection()
        cursor = connection.cursor()

        cursor.execute(
            "DELETE FROM users WHERE id=%s",
            (user_id,)
        )

        connection.commit()

        deleted = cursor.rowcount > 0

        cursor.close()
        connection.close()

        return deleted


    # ==========================================================================
    # Dashboard Administrativo
    # ==========================================================================

    def get_admin_statistics(self):

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT COUNT(*) total FROM users")
        users = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) total FROM quizzes")
        quizzes = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) total FROM badges")
        badges = cursor.fetchone()["total"]

        cursor.execute("SELECT COUNT(*) total FROM classrooms")
        classrooms = cursor.fetchone()["total"]

        cursor.close()
        connection.close()

        return {
            "users": users,
            "quizzes": quizzes,
            "badges": badges,
            "classrooms": classrooms
        }


    # ==========================================================================
    # Reports
    # ==========================================================================

    def get_system_report(self):

        connection = get_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                COUNT(*) AS total_users,
                AVG(xp) AS average_xp,
                MAX(level) AS highest_level
            FROM users
        """)

        report = cursor.fetchone()

        cursor.close()
        connection.close()

        return report