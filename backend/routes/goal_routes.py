from flask import Blueprint, request, jsonify
from models.goal import Goal
from database import db
from datetime import datetime
import dateutil.parser

goal_bp = Blueprint('goals', __name__)

@goal_bp.route('/create-goal', methods=['POST'])
def create_goal():
    """
    Example JSON request:
    {
        "user_id": 1,
        "goal_name": "Buy a laptop",
        "target_amount": 50000,
        "deadline": "2023-12-31T00:00:00Z"
    }
    
    Example JSON response:
    {
        "message": "Goal created successfully",
        "goal": {
            "id": 1,
            "user_id": 1,
            "goal_name": "Buy a laptop",
            "target_amount": 50000.0,
            "current_amount": 0.0,
            "deadline": "2023-12-31T00:00:00+00:00",
            "created_at": "2023-10-27T10:00:00"
        }
    }
    """
    data = request.json
    
    try:
        deadline = dateutil.parser.isoparse(data['deadline'])
        new_goal = Goal(
            user_id=data['user_id'],
            goal_name=data['goal_name'],
            target_amount=data['target_amount'],
            deadline=deadline
        )
        db.session.add(new_goal)
        db.session.commit()
        return jsonify({
            'message': 'Goal created successfully',
            'goal': new_goal.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@goal_bp.route('/user-goals', methods=['GET'])
def get_user_goals():
    """
    Example GET query: /user-goals?user_id=1
    
    Example JSON response:
    {
        "goals": [
            {
                "id": 1,
                "user_id": 1,
                "goal_name": "Buy a laptop",
                "target_amount": 50000.0,
                "current_amount": 1000.0,
                "deadline": "2023-12-31T00:00:00+00:00",
                "created_at": "2023-10-27T10:00:00"
            }
        ]
    }
    """
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'user_id is required'}), 400
        
    goals = Goal.query.filter_by(user_id=user_id).all()
    return jsonify({
        'goals': [goal.to_dict() for goal in goals]
    }), 200
