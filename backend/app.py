from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import db

from models.user import User
from models.goal import Goal
from models.saving import Saving
from models.quiz import Quiz

# Import blueprints
from routes.user_routes import user_bp
from routes.goal_routes import goal_bp
from routes.saving_routes import saving_bp
from routes.leaderboard_routes import leaderboard_bp
from routes.auth_routes import auth_bp
from routes.wallet_routes import wallet_bp
from routes.quiz_routes import quiz_bp
from routes.dashboard_routes import dashboard_bp

# to load environment variables from .env file
from dotenv import load_dotenv
import os

load_dotenv()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Enable CORS
    CORS(app)
    
    # Initialize database
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(user_bp, url_prefix='/')
    app.register_blueprint(goal_bp, url_prefix='/')
    app.register_blueprint(saving_bp, url_prefix='/')
    app.register_blueprint(leaderboard_bp, url_prefix='/')
    app.register_blueprint(auth_bp, url_prefix='/')
    app.register_blueprint(wallet_bp, url_prefix='/')
    app.register_blueprint(quiz_bp, url_prefix='/')
    app.register_blueprint(dashboard_bp, url_prefix='/')
    
    # Create tables
    with app.app_context():
        db.create_all()
        
    @app.route('/', methods=['GET'])
    def index():
        """
        Health check endpoint
        """
        return jsonify({"message": "Welcome to the Nickle API!"})
        
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
