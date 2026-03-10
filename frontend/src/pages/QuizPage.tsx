import React, { useEffect, useState } from 'react';
import { BrainCircuit, CheckCircle2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import DifficultyBadge from '../components/DifficultyBadge';
import api from '../services/api';

interface Question {
  id: number;
  question: string;
  options: {
    '1': string;
    '2': string;
    '3': string;
    '4': string;
  };
  coin_reward: number;
  difficulty?: 'easy' | 'medium' | 'hard' | string;
}

const QuizPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  const user = JSON.parse(localStorage.getItem('nickle_user') || '{}');

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await api.get('/weekly-quiz');
        setQuestions(response.data.questions || []);
      } catch (err: any) {
        setError('Failed to load this week\'s quiz. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  const handleSelectOption = (questionId: number, optionKey: string) => {
    if (result) return; // Prevent changing after submission
    setAnswers({
      ...answers,
      [questionId.toString()]: optionKey
    });
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      const errorMessage = 'Please answer all questions before submitting.';
      setError(errorMessage);
      toast.error(errorMessage);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        user_id: user.id,
        answers: answers
      };
      
      const response = await api.post('/submit-quiz', payload);
      setResult(response.data);
      toast.success('Quiz submitted successfully');
      
      // Update local storage user coins balance to reflect change
      if (response.data.new_balance) {
         user.coins = response.data.new_balance;
         localStorage.setItem('nickle_user', JSON.stringify(user));
      }
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to submit quiz.';
      setError(errorMessage);
      toast.error(errorMessage || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
     return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-purple-500" />
          Weekly Financial Quiz
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm mb-6">
          {error}
        </div>
      )}

      {result ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="inline-flex items-center justify-center p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full mb-6">
            <CheckCircle2 className="w-16 h-16" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Completed!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            You scored {result.correct_count} out of {result.total_questions} questions correctly.
          </p>
          
          <div className="inline-block bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 px-12">
            <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-1">Rewards Earned</p>
            <p className="text-4xl font-extrabold text-yellow-500">+{result.coins_earned} Coins</p>
            <p className="text-xs text-gray-500 mt-2">New Balance: {result.new_balance}</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl text-center shadow-sm">
               No questions available right now.
            </div>
          ) : (
            questions.map((q, index) => (
              <div key={q.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    <span className="text-purple-500 mr-2">Q{index + 1}.</span>
                    {q.question}
                  </h3>
                  <DifficultyBadge difficulty={q.difficulty} />
                </div>
                
                <div className="space-y-3">
                  {Object.entries(q.options).map(([key, text]) => {
                    const isSelected = answers[q.id.toString()] === key;
                    return (
                      <button
                        key={key}
                        onClick={() => handleSelectOption(q.id, key)}
                        className={`w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between ${
                          isSelected 
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span className="font-medium">{text}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-purple-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {questions.length > 0 && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2 disabled:bg-purple-400 text-lg shadow-lg shadow-purple-600/20"
            >
              {submitting ? 'Submitting...' : 'Submit Answers'}
              {!submitting && <ChevronRight className="w-5 h-5" />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
