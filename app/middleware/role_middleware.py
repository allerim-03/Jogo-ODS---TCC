"""
===========================================================================
ROLE MIDDLEWARE

Responsável pela autorização baseada em papéis (roles).

Pré-requisito:
- O usuário já deve estar autenticado através do @api_login_required.
- O JWT deve conter o campo "role".

Exemplo:

@api_login_required
@teacher_required
def create_quiz():
    ...

===========================================================================
"""

from functools import wraps

from flask import jsonify, g


def roles_required(*allowed_roles):
    """
    Permite acesso somente aos papéis informados.

    Exemplo:
        @roles_required("admin")

        @roles_required("teacher", "admin")
    """

    def decorator(view):

        @wraps(view)
        def wrapper(*args, **kwargs):

            current_user = g.get("current_user")

            if current_user is None:

                return jsonify({
                    "success": False,
                    "message": "Unauthorized."
                }), 401

            role = current_user.get("role")

            if role not in allowed_roles:

                return jsonify({
                    "success": False,
                    "message": "Permission denied."
                }), 403

            return view(*args, **kwargs)

        return wrapper

    return decorator


# ==========================================================================
# DECORATORS PRONTOS
# ==========================================================================

student_required = roles_required("student")

teacher_required = roles_required("teacher")

admin_required = roles_required("admin")