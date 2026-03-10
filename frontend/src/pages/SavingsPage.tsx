import React, { useState } from 'react';
import { PiggyBank, ArrowDownCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const SavingsPage = () => {
  const [goalId, setGoalId] = useState('');
  const [amount, setAmount] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<any>(null);
  
  const user = JSON.parse(localStorage.getItem('nickle_user') || '{}');

  const handleAddSaving = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessData(null);
    setLoading(true);

    try {
      const payload = {
        user_id: user.id,
        goal_id: parseInt(goalId, 10),
        amount: parseFloat(amount)
      };
      
      const response = await api.post('/add-saving', payload);
      
      setSuccessData(response.data);
      toast.success('Saving added +XP');
      setAmount('');
      setGoalId('');
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to add saving';
      setError(errorMessage);
      toast.error(errorMessage || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <PiggyBank className="w-8 h-8 text-emerald-500" />
          Add Savings
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-md border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Contribute to a Goal</h2>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}
        
        {successData && (
          <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 p-6 rounded-xl mb-8">
            <div className="flex items-center gap-3 text-emerald-700 dark:text-emerald-400 mb-4">
              <ArrowDownCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Latest savings update: ${successData.saving?.amount || amount}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500">XP Earned</p>
                <p className="text-xl font-bold text-indigo-600">+{successData.xp_earned || 0}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500">Coins Earned</p>
                <p className="text-xl font-bold text-yellow-500">+{successData.coins_earned || 0}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleAddSaving} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Target Goal ID
              </label>
              <input
                type="number"
                required
                min="1"
                value={goalId}
                onChange={(e) => setGoalId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter Goal ID (e.g. 1)"
              />
              <p className="text-xs text-gray-500 mt-2">
                (Check your Goals page for IDs, assuming goals are created.)
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deposit Amount ($)
              </label>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-xl font-bold"
                placeholder="0.00"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2 disabled:bg-emerald-400 text-lg shadow-lg shadow-emerald-600/20"
          >
            {loading ? 'Processing...' : 'Add Saving and Earn Rewards'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SavingsPage;
