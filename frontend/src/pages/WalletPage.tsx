import React, { useEffect, useRef, useState } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

const WalletPage = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositing, setDepositing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const depositSectionRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('nickle_user') || '{}');

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const response = await api.get(`/wallet/${user.id}`);
        setBalance(response.data.wallet_balance);
      } catch (err: any) {
        setError('Failed to fetch wallet info');
      } finally {
        setLoading(false);
      }
    };

    if (user.id) {
      fetchWallet();
    }
  }, [user.id]);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setDepositing(true);

    try {
      const response = await api.post('/wallet/deposit', {
        user_id: user.id,
        amount: parseFloat(depositAmount)
      });

      setBalance(response.data.wallet_balance);
      setDepositAmount('');
      toast.success('Deposit successful');
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Something went wrong';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setDepositing(false);
    }
  };

  const scrollToDeposit = () => {
    depositSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <WalletIcon className="w-8 h-8 text-indigo-500" />
          My Wallet
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center mb-6">
          {error}
        </div>
      )}

      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-8 text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-200">
        <p className="text-indigo-100 font-medium mb-2 opacity-90 uppercase tracking-wider text-sm">
          Wallet Balance
        </p>
        <div className="text-5xl font-extrabold flex items-center gap-2 mb-8">
          <span>$</span>
          {balance !== null ? balance.toFixed(2) : '0.00'}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={scrollToDeposit}
            className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:bg-indigo-50"
          >
            <ArrowUpRight className="w-5 h-5" />
            Deposit Funds
          </button>
          <button
            type="button"
            onClick={() => navigate('/savings')}
            className="inline-flex items-center justify-center gap-2 bg-indigo-400/30 text-white border border-white/35 px-6 py-3 rounded-lg font-bold transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-300/40 hover:shadow-lg"
          >
            <PlusCircle className="w-5 h-5" />
            Add Saving
          </button>
        </div>
      </div>

      <div
        ref={depositSectionRef}
        className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-200 border border-gray-100"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Deposit to Wallet</h2>
        <form onSubmit={handleDeposit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="number"
            min="1"
            step="0.01"
            required
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-900 px-4 py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300 w-full sm:max-w-xs"
            placeholder="Deposit amount"
          />
          <button
            type="submit"
            disabled={depositing}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-lg font-bold transition duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70"
          >
            <ArrowUpRight className="w-5 h-5" />
            {depositing ? 'Depositing...' : 'Confirm Deposit'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-200 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">About Your Wallet</h2>
        <p className="text-gray-600">
          Your wallet acts as the central hub for your unassigned funds. You can transfer funds from your wallet into individual savings goals using the Savings section.
        </p>
        <p className="text-gray-600 mt-4 text-sm font-medium bg-gray-50 p-4 rounded-lg border border-gray-200">
          To credit funds to a specific goal, navigate to the <strong>Savings</strong> tab and use the "Add Saving" function.
        </p>
      </div>
    </div>
  );
};

export default WalletPage;
