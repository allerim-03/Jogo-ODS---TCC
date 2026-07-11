#xp

#level

#progress

#history

#statistics


    
#===========================
# Progress
#===========================

@routes.route(
    "/user/<int:user_id>/progress",
    methods=["GET"]
)
def user_progress(user_id):

    user = get_user_progress(user_id)

    if not user:
        return jsonify({
            "message": "Usuário não encontrado"
        }), 404

    return jsonify(user)