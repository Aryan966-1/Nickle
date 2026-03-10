from flask import Blueprint, request, jsonify
from models.goal import Goal
from database import db
import dateutil.parser

goal_bp = Blueprint("goals", __name__)

# ---------------------------------------------------
# CREATE GOAL
# ---------------------------------------------------
@goal_bp.route("/goals", methods=["POST"])
def create_goal():
    """
    POST /goals

    Example request:
    {
        "user_id": 1,
        "goal_name": "Buy a laptop",
        "target_amount": 50000,
        "deadline": "2026-05-14"
    }
    """

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid request"}), 400

    try:
        deadline = dateutil.parser.isoparse(data["deadline"])

        new_goal = Goal(
            user_id=data["user_id"],
            goal_name=data["goal_name"],
            target_amount=data["target_amount"],
            deadline=deadline
        )

        db.session.add(new_goal)
        db.session.commit()

        return jsonify({
            "message": "Goal created successfully",
            "goal": new_goal.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400


# ---------------------------------------------------
# GET ALL GOALS FOR USER
# ---------------------------------------------------
@goal_bp.route("/goals", methods=["GET"])
def get_goals():
    """
    GET /goals?user_id=1
    """

    user_id = request.args.get("user_id")

    if not user_id:
        return jsonify({"error": "user_id is required"}), 400

    goals = Goal.query.filter_by(user_id=user_id).all()

    return jsonify({
        "goals": [goal.to_dict() for goal in goals]
    }), 200


# ---------------------------------------------------
# GET SINGLE GOAL
# ---------------------------------------------------
@goal_bp.route("/goals/<int:goal_id>", methods=["GET"])
def get_single_goal(goal_id):

    goal = Goal.query.get(goal_id)

    if not goal:
        return jsonify({"error": "Goal not found"}), 404

    return jsonify(goal.to_dict()), 200


# ---------------------------------------------------
# DELETE GOAL
# ---------------------------------------------------
@goal_bp.route("/goals/<int:goal_id>", methods=["DELETE"])
def delete_goal(goal_id):

    goal = Goal.query.get(goal_id)

    if not goal:
        return jsonify({"error": "Goal not found"}), 404

    db.session.delete(goal)
    db.session.commit()

    return jsonify({"message": "Goal deleted successfully"}), 200


# ---------------------------------------------------
# UPDATE GOAL
# ---------------------------------------------------
@goal_bp.route("/goals/<int:goal_id>", methods=["PUT"])
def update_goal(goal_id):

    goal = Goal.query.get(goal_id)

    if not goal:
        return jsonify({"error": "Goal not found"}), 404

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Invalid request"}), 400

    try:
        if "goal_name" in data:
            goal.goal_name = data["goal_name"]

        if "target_amount" in data:
            goal.target_amount = data["target_amount"]

        if "deadline" in data:
            goal.deadline = dateutil.parser.isoparse(data["deadline"])

        db.session.commit()

        return jsonify({
            "message": "Goal updated successfully",
            "goal": goal.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400
