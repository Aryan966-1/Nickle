from database import db

class Quiz(db.Model):
    __tablename__ = 'quizzes'

    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(500), nullable=False)
    option1 = db.Column(db.String(255), nullable=False)
    option2 = db.Column(db.String(255), nullable=False)
    option3 = db.Column(db.String(255), nullable=False)
    option4 = db.Column(db.String(255), nullable=False)
    correct_answer = db.Column(db.Integer, nullable=False)
    coin_reward = db.Column(db.Integer, default=10)

    def to_dict(self):
        return {
            'id': self.id,
            'question': self.question,
            'options': {
                '1': self.option1,
                '2': self.option2,
                '3': self.option3,
                '4': self.option4
            },
            'coin_reward': self.coin_reward
            # specifically omitting correct_answer for secure client payloads, mostly up to discretion
        }
