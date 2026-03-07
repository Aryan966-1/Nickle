from flask import Blueprint, request, jsonify
from models.saving import Saving
from models.goal import Goal
from models.user import User
from database import db

from utils.gamification import update_gamification
from utils.financial_advice import generate_financial_advice as basic_advice
from utils.gemini_ai import generate_financial_advice as gemini_advice

saving_bp = Blueprint('savings', __name__)


@saving_bp.route('/add-saving', methods=['POST'])
def add_saving():
    """
    Example JSON request:
    {
        "user_id": 1,
        "goal_id": 1,
        "amount": 500
    }
    """

    data = request.json
    user_id = data.get('user_id')
    goal_id = data.get('goal_id')
    amount = data.get('amount')

    # Validate input
    if not user_id or not goal_id or amount is None:
        return jsonify({
            "error": "user_id, goal_id, and amount are required"
        }), 400

    if amount <= 0:
        return jsonify({
            "error": "Amount must be greater than zero"
        }), 400

    try:

        user = User.query.get(user_id)
        goal = Goal.query.get(goal_id)

        if not user or not goal:
            return jsonify({
                "error": "User or Goal not found"
            }), 404

        # 1️⃣ Insert saving record
        new_saving = Saving(
            user_id=user_id,
            goal_id=goal_id,
            amount=amount
        )

        db.session.add(new_saving)

        # 2️⃣ Update goal progress
        goal.current_amount += amount

        # Calculate gamification rewards
        xp_earned = int(amount / 10)
        coins_earned = int(amount / 100)

        # 3️⃣ Update XP / coins / level
        update_gamification(user, amount)

        db.session.commit()

        # 4️⃣ Generate AI financial advice
        try:
            advice = gemini_advice(
                goal_name=goal.goal_name,
                target_amount=goal.target_amount,
                current_amount=goal.current_amount
            )
        except Exception:
            # fallback if Gemini fails
            advice = basic_advice(
                target_amount=goal.target_amount,
                current_amount=goal.current_amount,
                deadline=goal.deadline
            )

        return jsonify({

            "message": "Saving added successfully",

            "xp_earned": xp_earned,
            "coins_earned": coins_earned,

            "saving": new_saving.to_dict(),
            "goal": goal.to_dict(),
            "user": user.to_dict(),

            "ai_advice": advice

        }), 201

    except Exception as e:

        db.session.rollback()

        return jsonify({
            "error": str(e)
        }), 400