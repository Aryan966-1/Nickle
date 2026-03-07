from database import db
from datetime import datetime, timezone

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=True)
    wallet_balance = db.Column(db.Float, default=0.0)
    streak = db.Column(db.Integer, default=0)
    last_save_date = db.Column(db.Date, nullable=True)
    xp = db.Column(db.Integer, default=0)
    coins = db.Column(db.Integer, default=0)
    level = db.Column(db.Integer, default=1)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'wallet_balance': self.wallet_balance,
            'streak': self.streak,
            'last_save_date': self.last_save_date.isoformat() if self.last_save_date else None,
            'xp': self.xp,
            'coins': self.coins,
            'level': self.level,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
