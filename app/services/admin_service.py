"""
===========================================================================
ADMIN SERVICE

Responsável pelas regras de negócio da área administrativa.

Exemplos:

- gerenciamento de escolas
- gerenciamento de usuários
- gerenciamento de quizzes
- estatísticas gerais
- relatórios

Não acessa HTTP.
Não renderiza páginas.
Toda persistência fica nos repositories.



modulo administrativo
Escolas: criar, editar, excluir e listar escolas.
Usuários: listar usuários, alterar perfil (estudante/gestor/admin), ativar/desativar contas e excluir usuários.
Quizzes: utilizar o quiz_service para criar, editar e remover quizzes (sem duplicar lógica).
Dashboard administrativo: estatísticas gerais (número de usuários, escolas, quizzes, jogos, XP total, etc.).
Relatórios: consolidação de dados e exportação (CSV/PDF) futuramente
===========================================================================
"""

from app.repositories.admin_repository import (
    create_school,
    delete_school,
    get_all_users,
    get_dashboard_statistics
)


class AdminService:

    # ======================================================================
    # Escolas
    # ======================================================================

    def create_school(self, data):

        school_id = create_school(data)

        return {
            "success": True,
            "message": "School created successfully.",
            "school_id": school_id
        }

    def delete_school(self, school_id):

        deleted = delete_school(school_id)

        if not deleted:

            return {
                "success": False,
                "message": "School not found."
            }

        return {
            "success": True,
            "message": "School deleted successfully."
        }

    # ======================================================================
    # Usuários
    # ======================================================================

    def list_users(self):

        users = get_all_users()

        return {
            "success": True,
            "users": users
        }

    # ======================================================================
    # Dashboard Administrativo
    # ======================================================================

    def dashboard_statistics(self):

        statistics = get_dashboard_statistics()

        return {
            "success": True,
            "statistics": statistics
        }