#GET quizzes

#GET quiz

#POST submit

#POST create

#PUT update

#DELETE

#==============================
#importes
#=====================================
from app.middleware.auth_middleware import api_login_required
from flask import Blueprint, jsonify, request
from app.repositories.quiz_repository import get_all_quizzes
from app.services.quiz_service import get_quiz_details
from app.services.quiz_service import submit_quiz as submit_quiz_service
from app.services.quiz_service import (
    create_quiz_service,
    update_quiz_service,
    delete_quiz_service
)
from app.services.quiz_service import QuizService
'''
from app.services.quiz_service import (
    get_quiz_results_service
)
from app.services.quiz_service import (
    create_question_service,
    update_question_service,
    delete_question_service
)'''
from app.repositories.quiz_repository import (
    get_all_quizzes,
    get_all_quizzes_admin,
    get_quiz_results
)


quiz_service = QuizService()

quiz_bp = Blueprint("quizzes", __name__)

#===========================
# quiz.py
#=========================

# API
@quiz_bp.route("/api/quizzes", methods=["GET"])
@api_login_required
def list_quizzes():

    quizzes = get_all_quizzes()

    return jsonify(quizzes), 200

@quiz_bp.route("/api/quizzes/<int:quiz_id>", methods=["GET"])
@api_login_required
def get_quiz(quiz_id):

    quiz = get_quiz_details(quiz_id)

    if quiz is None:
        return jsonify({
            "success": False,
            "message": "Quiz not found."
        }), 404

    return jsonify(quiz), 200

@quiz_bp.route("/api/quizzes/<int:quiz_id>/submit", methods=["POST"])
@api_login_required
def submit_quiz_route(quiz_id):

    data = request.get_json()

    result = submit_quiz_service(
        quiz_id=quiz_id,
       user_id = g.current_user["id"],
        answers=data["answers"]
    )

    if result is None:
        return jsonify({
            "success": False,
            "message": "Quiz not found."
        }), 404

    return jsonify(result), 200
@quiz_bp.route("/api/quizzes", methods=["POST"])
# adicionar @teacher_required
@api_login_required
def create_quiz_route():

    data = request.get_json()
    quiz_id = create_quiz_service(data)
    return jsonify({
        "success": True,
        "quiz_id": quiz_id
    }), 201
@quiz_bp.route("/api/quizzes/<int:quiz_id>", methods=["PUT"])
@api_login_required
# adicionar @teacher_required
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
    
@quiz_bp.route("/api/quizzes/<int:quiz_id>", methods=["DELETE"])
@api_login_required
# adicionar @teacher_required
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
@quiz_bp.route("/api/quizzes/results", methods=["GET"])
@api_login_required
def quiz_results():

    results = get_quiz_results_service()

    return jsonify(results), 200

#==============
#questões
#======================
@quiz_bp.route("/api/questions", methods=["POST"])
@api_login_required
def create_question_route():

    data = request.get_json()

    result = create_question_service(data)

    return jsonify(result),201
@quiz_bp.route("/api/questions/<int:question_id>", methods=["PUT"])
@api_login_required
# adicionar @teacher_required
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
@quiz_bp.route("/api/questions/<int:question_id>", methods=["DELETE"])
@api_login_required
def delete_question_route(question_id):

    result = delete_question_service(question_id)

    if result is None:

        return jsonify({
            "success":False,
            "message":"Pergunta não encontrada."
        }),404

    return jsonify(result),200

@quiz_bp.route("/api/quizzes/admin", methods=["GET"])
@api_login_required
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

