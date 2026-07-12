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
    # Badges conquistadas pelo usuário
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
    # Lista todas as badges existentes
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
    # Busca uma badge pelo ID
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
# COMPATIBILIDADE TEMPORÁRIA
# =====================================================

_repository = BadgeRepository()


def get_user_badges(user_id):
    return _repository.get_user_badges(user_id)


def get_all_badges():
    return _repository.get_all_badges()


def get_badge_by_id(badge_id):
    return _repository.get_badge_by_id(badge_id)