#parte para a etapa de desenvolvimento

'''
/ping

/test

/debug

/reset-db

/mock
'''
#imports
from app.repositories.badge_repository import get_user_badges

#rota para testes 
@routes.route("/test-badges/<int:user_id>")
def test_badges(user_id):

    user = user_repository.get_by_id(user_id)

    check_and_award_badges(
        user["id"],
        user["xp"],
        user["level"]
    )

    return jsonify({
        "message": "Badges verificadas"
    })


@routes.route("/test-dashboard")
def dashboard():
    return {
        "message": "dashboard ok"
    }
    


#teste banco de dados conecta
@routes.route("/test-db")
def test_db():

    conn = get_connection()

    if conn.is_connected():
        return {"message": "Banco conectado"}

    return {"message": "Erro"}