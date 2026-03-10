import React from 'react';
import { Target, Pencil, Trash2 } from 'lucide-react';
import DifficultyBadge from './DifficultyBadge';

export interface GoalData {
  id: number;
  goal_name: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  difficulty?: 'easy' | 'medium' | 'hard' | string;
}

interface GoalCardProps {
  goal: GoalData;
  deleteGoal: (goalId: number) => void;
  editGoal: (goal: GoalData) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, deleteGoal, editGoal }) => {
  const safeTarget = goal.target_amount > 0 ? goal.target_amount : 1;
  const progress = Math.min(100, Math.max(0, (goal.current_amount / safeTarget) * 100));
  const isCompleted = progress >= 100;
  const deadlineDate = new Date(goal.deadline);
  const daysRemaining = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const deadlineCountdown = isCompleted
    ? 'Completed'
    : daysRemaining > 0
      ? `${daysRemaining} day${daysRemaining === 1 ? '' : 's'} left`
      : daysRemaining === 0
        ? 'Due today'
        : `${Math.abs(daysRemaining)} day${Math.abs(daysRemaining) === 1 ? '' : 's'} overdue`;

  const handleDelete = () => {
    const confirmed = window.confirm('Are you sure you want to delete this goal?');
    if (!confirmed) return;
    deleteGoal(goal.id);
  };

  const handleEdit = () => {
    editGoal(goal);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-200 border ${isCompleted ? 'border-emerald-400' : 'border-gray-100 dark:border-gray-700'} relative overflow-hidden`}>
      {isCompleted && (
         <div className="absolute top-0 left-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg">
           COMPLETED
         </div>
      )}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={handleEdit}
          className="text-gray-500 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition duration-200"
          aria-label={`Edit ${goal.goal_name}`}
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="text-red-500 hover:text-red-600 transition duration-200"
          aria-label={`Delete ${goal.goal_name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-lg">
          <Target className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">{goal.goal_name}</h3>
            <DifficultyBadge difficulty={goal.difficulty} />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Target amount: ${goal.target_amount.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-300">${goal.current_amount.toFixed(2)} saved</span>
          <span className="font-medium text-indigo-600 dark:text-indigo-300">{progress.toFixed(0)}%</span>
        </div>
        <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-700 ease-out rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
        <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
          <span>Deadline</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">{deadlineDate.toLocaleDateString()}</span>
        </div>
        <div className="text-xs flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Countdown</span>
          <span className={`font-semibold ${isCompleted ? 'text-emerald-600' : daysRemaining >= 0 ? 'text-teal-500' : 'text-rose-600'}`}>
            {deadlineCountdown}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
