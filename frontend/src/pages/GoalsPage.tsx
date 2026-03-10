import React, { useState, useEffect } from 'react';
import { Target, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import GoalCard, { GoalData } from '../components/GoalCard';
import api from '../services/api';

const GoalsPage = () => {
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  const [goals, setGoals] = useState<GoalData[]>([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<GoalData | null>(null);
  const [editGoalName, setEditGoalName] = useState('');
  const [editTargetAmount, setEditTargetAmount] = useState('');
  const [editDeadline, setEditDeadline] = useState('');

  const user = JSON.parse(localStorage.getItem('nickle_user') || '{}');

  const fetchGoals = async () => {
    try {
      const response = await api.get(`/goals?user_id=${user.id}`);
      setGoals(response.data.goals || []);
    } catch (err) {
      console.error('Failed to fetch goals', err);
    }
  };

  useEffect(() => {
    if (user.id) {
      fetchGoals();
    }
  }, [user.id]);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreateLoading(true);

    try {
      const payload = {
        user_id: user.id,
        goal_name: goalName,
        target_amount: parseFloat(targetAmount),
        deadline
      };

      await api.post('/goals', payload);

      toast.success('Goal created successfully');
      setGoalName('');
      setTargetAmount('');
      setDeadline('');
      await fetchGoals();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create goal';
      setError(errorMessage);
      toast.error(errorMessage || 'Something went wrong');
    } finally {
      setCreateLoading(false);
    }
  };

  const deleteGoal = async (goalId: number) => {
    try {
      await api.delete(`/goals/${goalId}`);
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
      toast.success('Goal deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to delete goal');
    }
  };

  const openEditModal = (goal: GoalData) => {
    setEditingGoal(goal);
    setEditGoalName(goal.goal_name);
    setEditTargetAmount(String(goal.target_amount));
    setEditDeadline(new Date(goal.deadline).toISOString().split('T')[0]);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingGoal(null);
    setEditGoalName('');
    setEditTargetAmount('');
    setEditDeadline('');
  };

  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingGoal) {
      return;
    }

    const confirmed = window.confirm('Are you sure you want to save these goal changes?');
    if (!confirmed) {
      return;
    }

    setUpdateLoading(true);

    try {
      const payload = {
        goal_name: editGoalName,
        target_amount: parseFloat(editTargetAmount),
        deadline: editDeadline
      };

      const response = await api.put(`/goals/${editingGoal.id}`, payload);
      const updatedGoal = response.data?.goal || {
        ...editingGoal,
        ...payload,
        deadline: editDeadline
      };

      setGoals((prevGoals) =>
        prevGoals.map((goal) => (goal.id === editingGoal.id ? updatedGoal : goal))
      );

      toast.success('Goal updated successfully');
      closeEditModal();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update goal');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
        <Target className="w-8 h-8 text-indigo-500" />
        Financial Goals
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-200 border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-500" />
              Create New Goal
            </h2>

            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateGoal} className="space-y-4">
              <input
                type="text"
                required
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Goal name"
              />

              <input
                type="number"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Target amount"
              />

              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />

              <button
                type="submit"
                disabled={createLoading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold transition duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70"
              >
                {createLoading ? 'Creating...' : 'Create Goal'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          {goals.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-10 rounded-xl text-center border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-200 text-gray-700 dark:text-gray-300">
              No goals yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {goals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} deleteGoal={deleteGoal} editGoal={openEditModal} />
              ))}
            </div>
          )}
        </div>
      </div>

      {isEditModalOpen && editingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Edit Goal</h3>
              <button
                type="button"
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateGoal} className="space-y-4">
              <input
                type="text"
                required
                value={editGoalName}
                onChange={(e) => setEditGoalName(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Goal name"
              />

              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={editTargetAmount}
                onChange={(e) => setEditTargetAmount(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="Target amount"
              />

              <input
                type="date"
                required
                value={editDeadline}
                onChange={(e) => setEditDeadline(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:shadow-lg transition duration-200 disabled:opacity-70"
                >
                  {updateLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
