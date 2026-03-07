from flask import Blueprint, request, jsonify
from database import db
from models.quiz import Quiz
from models.user import User

quiz_bp = Blueprint('quiz', __name__)


@quiz_bp.route('/weekly-quiz', methods=['GET'])
def get_weekly_quiz():
    """
    Returns 5 random quiz questions.
    """
    quizzes = Quiz.query.order_by(db.func.random()).limit(5).all()

    return jsonify({
        "questions": [q.to_dict() for q in quizzes]
    }), 200


@quiz_bp.route('/submit-quiz', methods=['POST'])
def submit_quiz():
    """
    Accepts answers in TWO formats.

    Format 1 (recommended):

    {
        "user_id":1,
        "answers":{
            "1":2,
            "2":1,
            "3":4,
            "4":3,
            "5":2
        }
    }

    Format 2 (also accepted):

    {
        "user_id":1,
        "answers":[2,1,4,3,2]
    }
    """

    data = request.json
    user_id = data.get('user_id')
    answers = data.get('answers')

    if not user_id or answers is None:
        return jsonify({"error": "user_id and answers are required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    correct_count = 0

    # ---------- HANDLE DICTIONARY FORMAT ----------
    if isinstance(answers, dict):

        for str_quiz_id, selected_option in answers.items():
            try:
                quiz_id = int(str_quiz_id)
                quiz = Quiz.query.get(quiz_id)

                if quiz and quiz.correct_answer == int(selected_option):
                    correct_count += 1

            except Exception:
                continue

        total_questions = len(answers)

    # ---------- HANDLE LIST FORMAT ----------
    elif isinstance(answers, list):

        total_questions = len(answers)

        quizzes = Quiz.query.order_by(db.func.random()).limit(total_questions).all()

        for quiz, selected_option in zip(quizzes, answers):
            try:
                if quiz.correct_answer == int(selected_option):
                    correct_count += 1
            except Exception:
                continue

    else:
        return jsonify({"error": "answers must be a list or dictionary"}), 400


    # ---------- REWARD CALCULATION ----------
    reward = 0

    if correct_count == 5:
        reward = 200
    elif correct_count == 4:
        reward = 80
    elif correct_count == 3:
        reward = 60
    elif correct_count == 2:
        reward = 40
    elif correct_count == 1:
        reward = 20


    if reward > 0:
        user.coins += reward

        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 400


    return jsonify({
        "message": "Quiz submitted successfully",
        "correct_count": correct_count,
        "total_questions": total_questions,
        "coins_earned": reward,
        "new_balance": user.coins
    }), 200