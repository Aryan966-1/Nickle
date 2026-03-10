from flask import Blueprint, request, jsonify
from models.user import User
from database import db

user_bp = Blueprint('users', __name__)

@user_bp.route('/create-user', methods=['POST'])
def create_user():
    """
    Example JSON request:
    {
        "name": "Jane Doe",
        "email": "jane@example.com"
    }
    
    Example JSON response:
    {
        "message": "User created successfully",
        "user": {
            "id": 1,
            "name": "Jane Doe",
            "email": "jane@example.com",
            "xp": 0,
            "coins": 0,
            "level": 1,
            "created_at": "2023-10-27T10:00:00"
        }
    }
    """
    data = request.get_json(silent=True)
    if not data or not data.get('name') or not data.get('email'):
        return jsonify({'error': 'Name and email are required'}), 400
        
    try:
        new_user = User(
            name=data['name'],
            email=data['email']
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({
            'message': 'User created successfully',
            'user': new_user.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
