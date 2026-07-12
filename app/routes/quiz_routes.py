#GET quizzes

#GET quiz

#POST submit

#POST create

#PUT update

#DELETE

#
#importes
#


from app.repositories.quiz_repository import get_all_quizzes
from app.services.quiz_service import get_quiz_details
from app.services.quiz_service import submit_quiz as submit_quiz_service
from app.services.quiz_service import (
    create_quiz_service,
    update_quiz_service,
    delete_quiz_service
)

from app.services.quiz_service import (
    get_quiz_results_service
)
from app.services.quiz_service import (
    create_question_service,
    update_question_service,
    delete_question_service
)
from app.repositories.quiz_repository import (
    get_all_quizzes,
    get_all_quizzes_admin,
    get_quiz_results
)

#===========================
# quiz.py
#=========================

# API
@routes.route("/api/quizzes", methods=["GET"])
def list_quizzes():

    quizzes = get_all_quizzes()

    return jsonify(quizzes), 200

@routes.route("/api/quizzes/<int:quiz_id>", methods=["GET"])
def get_quiz(quiz_id):

    quiz = get_quiz_details(quiz_id)

    if quiz is None:
        return jsonify({
            "success": False,
            "message": "Quiz not found."
        }), 404

    return jsonify(quiz), 200

@routes.route("/api/quizzes/<int:quiz_id>/submit", methods=["POST"])
def submit_quiz_route(quiz_id):

    data = request.get_json()

    result = submit_quiz_service(
        quiz_id=quiz_id,
        user_id=data["user_id"],
        answers=data["answers"]
    )

    if result is None:
        return jsonify({
            "success": False,
            "message": "Quiz not found."
        }), 404

    return jsonify(result), 200
@routes.route("/api/quizzes", methods=["POST"])
def create_quiz_route():

    data = request.get_json()
    quiz_id = create_quiz_service(data)
    return jsonify({
        "success": True,
        "quiz_id": quiz_id
    }), 201
@routes.route("/api/quizzes/<int:quiz_id>", methods=["PUT"])
def update_quiz_route(quiz_id):

    data = request.get_json()
    result = update_quiz_service(quiz_id, data)

    if result is None:
        return jsonify({
            "success": False,
            "message": "Quiz não encontrado."
        }), 404

    return jsonify(result), 200
'''
    success = update_quiz(quiz_id, data)

    if not success:

        return jsonify({
            "success": False,
            "message": "Quiz não encontrado."
        }), 404

    return jsonify({
        "success": True
    }), 200
'''
    
@routes.route("/api/quizzes/<int:quiz_id>", methods=["DELETE"])
def delete_quiz_route(quiz_id):
    result = delete_quiz_service(quiz_id)

    if result is None:
        return jsonify({
            "success": False,
            "message": "Quiz não encontrado."
        }), 404

    return jsonify(result), 200
'''
    success = delete_quiz(quiz_id)

    if not success:

        return jsonify({
            "success": False,
            "message": "Quiz não encontrado."
        }), 404

    return jsonify({
        "success": True
    }), 200
'''
@routes.route("/api/quizzes/results", methods=["GET"])
def quiz_results():

    results = get_quiz_results_service()

    return jsonify(results), 200

#==============
#questões
#======================
@routes.route("/api/questions", methods=["POST"])
def create_question_route():

    data = request.get_json()

    result = create_question_service(data)

    return jsonify(result),201
@routes.route("/api/questions/<int:question_id>", methods=["PUT"])
def update_question_route(question_id):

    data = request.get_json()

    result = update_question_service(
        question_id,
        data
    )

    if result is None:

        return jsonify({
            "success":False,
            "message":"Pergunta não encontrada."
        }),404

    return jsonify(result),200
@routes.route("/api/questions/<int:question_id>", methods=["DELETE"])
def delete_question_route(question_id):

    result = delete_question_service(question_id)

    if result is None:

        return jsonify({
            "success":False,
            "message":"Pergunta não encontrada."
        }),404

    return jsonify(result),200

@routes.route("/api/quizzes/admin", methods=["GET"])
def list_admin_quizzes():

    quizzes = get_all_quizzes_admin()

    return jsonify(quizzes), 200


'''
adicionar no futuro
gestor // (area administrativa)
POST   /api/quizzes
PUT    /api/quizzes/<id>
DELETE /api/quizzes/<id>
GET /api/users/<int:user_id>/quiz-results- historico
'''
# ==========================
# PAINEL ADMIN - QUIZZES
# ==========================

@routes.route("/admin/quizzes")
def quiz_admin():

    return render_template(
        "quizzes/quiz-admin.html",
        perfil="professor"
    )
@routes.route("/admin/quizzes/<int:quiz_id>/questions")
def question_admin(quiz_id):

    return render_template(
        "quizzes/quiz-question-admin.html",
        quiz_id=quiz_id,
        perfil="professor"
    )


@routes.route('/quiz/submit', methods=['POST'])
def submit_game_quiz():
    data = request.json

    user_id = data["user_id"]
    score = data["score"]

    xp_gained = score * 10
   

    user, xp_gained = process_game_score(
        user_id,
        score
    )

    return jsonify({
        "message": "Quiz finalizado",
        "xp_gained": xp_gained,
        "xp": user["xp"],
        "level": user["level"]
    })
'''
--versão com login e autenticação
@routes.route("/admin/quizzes")
@login_required
@teacher_required
def quiz_admin():

    return render_template(
        "quizzes/quiz-admin.html",
        perfil="professor"
    )
    '''

