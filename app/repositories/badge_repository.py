
"""
===========================================================================
BADGE REPOSITORY

Responsabilidade:
- Consultar badges do usuário.
- Conquistas disponíveis.
- Inventário de badges.

Não contém regras de negócio.
===========================================================================
"""

from database.connection import get_connection


class BadgeRepository:

    # =====================================================
    # BADGES CONQUISTADAS PELO USUÁRIO
    # =====================================================

    def get_user_badges(self, user_id):

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                b.id,
                b.name,
                b.description
            FROM inventory_badge ib
            INNER JOIN badge b
                ON ib.badge_id = b.id
            WHERE ib.user_id = %s
            ORDER BY b.id
        """, (user_id,))

        badges = cursor.fetchall()

        cursor.close()
        conn.close()

        return badges


    # =====================================================
    # LISTA TODAS AS BADGES EXISTENTES
    # =====================================================

    def get_all_badges(self):

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                name,
                description
            FROM badge
            ORDER BY id
        """)

        badges = cursor.fetchall()

        cursor.close()
        conn.close()

        return badges


    # =====================================================
    # BUSCA UMA BADGE PELO ID
    # =====================================================

    def get_badge_by_id(self, badge_id):

        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                name,
                description
            FROM badge
            WHERE id = %s
        """, (badge_id,))

        badge = cursor.fetchone()

        cursor.close()
        conn.close()

        return badge


    # =====================================================
    # VERIFICAR SE USUÁRIO POSSUI BADGE
    # =====================================================

    def user_has_badge(
        self,
        user_id,
        badge_id
    ):
        """
        Verifica se o usuário já possui uma determinada badge.
        """

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            SELECT id
            FROM inventory_badge
            WHERE user_id = %s
            AND badge_id = %s
            """,
            (
                user_id,
                badge_id
            )
        )

        result = cursor.fetchone()

        cursor.close()
        conn.close()

        return result is not None


    # =====================================================
    # CONCEDER BADGE
    # =====================================================

    def award_badge(
        self,
        user_id,
        badge_id
    ):
        """
        Registra uma badge conquistada pelo usuário.
        """

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute(
            """
            INSERT INTO inventory_badge
            (
                user_id,
                badge_id
            )
            VALUES (%s, %s)
            """,
            (
                user_id,
                badge_id
            )
        )

        conn.commit()

        badge_id_created = cursor.lastrowid

        cursor.close()
        conn.close()

        return badge_id_created


# =====================================================
# INSTÂNCIA DO REPOSITORY
# =====================================================

_repository = BadgeRepository()


# =====================================================
# COMPATIBILIDADE TEMPORÁRIA
# =====================================================

def get_user_badges(user_id):
    return _repository.get_user_badges(user_id)


def get_all_badges():
    return _repository.get_all_badges()


def get_badge_by_id(badge_id):
    return _repository.get_badge_by_id(badge_id)

