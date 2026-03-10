import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Trophy,
  Star,
  PiggyBank,
  Flame,
  Coins,
  ShieldCheck,
  Brain,
  User,
  ChevronDown,
  Settings,
  LogOut
} from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from '../components/StatCard';
import XpProgress from '../components/XpProgress';
import api from '../services/api';

interface DashboardData {
  xp: number;
  coins: number;
  level: number;
  streak: number;
  wallet_balance: number;
  total_saved: number;
  leaderboard_rank: number;
}

interface GoalSummary {
  id: number;
  goal_name: string;
  target_amount: number;
  current_amount: number;
}

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const buildWeeklySavingsData = (totalSaved: number) => {
  const cumulativeWeights = [0.08, 0.16, 0.27, 0.41, 0.58, 0.77, 1];
  return WEEK_DAYS.map((day, index) => ({
    day,
    savings: Number((totalSaved * cumulativeWeights[index]).toFixed(2))
  }));
};

const DashboardPage = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [goals, setGoals] = useState<GoalSummary[]>([]);
  const [goalsCompleted, setGoalsCompleted] = useState(0);
  const [totalGoals, setTotalGoals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('nickle_user') || '{}');
  const userInitial = (user.name || 'U').charAt(0).toUpperCase();

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const dashboardResponse = await api.get(`/dashboard/${user.id}`);
        setData(dashboardResponse.data);

        try {
          const goalsResponse = await api.get(`/goals?user_id=${user.id}`);
          const userGoals: GoalSummary[] = goalsResponse.data?.goals || [];
          setGoals(userGoals);
          const completed = userGoals.filter(
            (goal) => Number(goal.current_amount) >= Number(goal.target_amount)
          ).length;
          setGoalsCompleted(completed);
          setTotalGoals(userGoals.length);
        } catch {
          setGoals([]);
          setGoalsCompleted(0);
          setTotalGoals(0);
        }
      } catch (err: any) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (user.id) {
      fetchDashboard();
    }
  }, [user.id]);

  const handleLogout = () => {
    localStorage.removeItem('nickle_user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center">
        {error || 'An error occurred'}
      </div>
    );
  }

  const weeklySavingsData = buildWeeklySavingsData(data.total_saved);
  const weeklySaved = Math.max(0, Number((data.total_saved / Math.max(data.streak, 1)).toFixed(2)));
  const nextGoal = goals
    .map((goal) => ({
      ...goal,
      remaining: Math.max(Number(goal.target_amount) - Number(goal.current_amount), 0)
    }))
    .filter((goal) => goal.remaining > 0)
    .sort((a, b) => a.remaining - b.remaining)[0];
  const projectedWeeks = nextGoal && weeklySaved > 0
    ? Math.max(1, Math.ceil(nextGoal.remaining / weeklySaved))
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome back, {user.name}!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your savings today.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-full">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            <span className="font-semibold text-indigo-700 dark:text-indigo-300">Level {data.level}</span>
          </div>

          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:scale-[1.02] transition duration-200"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold">
                {userInitial}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-300" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow rounded-xl border border-gray-100 dark:border-gray-700 z-20">
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-xl"
                >
                  <span className="inline-flex items-center gap-2"><User className="w-4 h-4" />Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    toast('Settings page coming soon');
                  }}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span className="inline-flex items-center gap-2"><Settings className="w-4 h-4" />Settings</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-b-xl"
                >
                  <span className="inline-flex items-center gap-2"><LogOut className="w-4 h-4" />Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-200 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-5/12">
            <p className="text-sm font-semibold text-indigo-600 mb-3 uppercase tracking-wide">Gamification Overview</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-indigo-50 dark:bg-indigo-900/20 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Level</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-300">{data.level}</p>
              </div>
              <div className="rounded-xl bg-orange-50 dark:bg-orange-900/20 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Streak</p>
                <div className="flex items-center gap-2">
                  {data.streak > 0 && <Flame className="w-5 h-5 text-orange-500 animate-pulse" />}
                  <p className="text-2xl font-bold text-orange-500">{data.streak}</p>
                </div>
              </div>
              <div className="rounded-xl bg-purple-50 dark:bg-purple-900/20 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nickle Coins</p>
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">{data.coins}</p>
              </div>
              <div className="rounded-xl bg-teal-50 dark:bg-teal-900/20 p-4">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Goals Completed</p>
                <p className="text-2xl font-bold text-teal-500">{goalsCompleted}</p>
                <p className="text-xs text-gray-400 mt-1">of {totalGoals} goals</p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-7/12 rounded-xl bg-[#F6F8FB] dark:bg-gray-900 p-5 border border-indigo-100 dark:border-gray-700">
            <XpProgress xp={data.xp} level={data.level} embedded />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total XP"
          value={data.xp}
          icon={Star}
          colorClass="bg-yellow-100 text-yellow-600"
          subtitle="Top 10% this week"
        />
        <StatCard
          title="Current Streak"
          value={`${data.streak} Days`}
          icon={Flame}
          colorClass="bg-orange-100 text-orange-600"
          subtitle="Keep it up!"
        />
        <StatCard
          title="Total Saved"
          value={`$${data.total_saved.toFixed(2)}`}
          icon={PiggyBank}
          colorClass="bg-teal-100 text-teal-500"
          subtitle="All time savings"
        />
        <StatCard
          title="Nickle Coins"
          value={data.coins}
          icon={Coins}
          colorClass="bg-purple-100 text-purple-600"
          subtitle="Used for rewards"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-200 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => navigate('/savings')}
            className="px-4 py-3 bg-white dark:bg-gray-700 rounded-xl shadow hover:scale-[1.02] transition duration-200 text-gray-800 dark:text-gray-100 font-semibold"
          >
            Add Saving
          </button>
          <button
            type="button"
            onClick={() => navigate('/goals')}
            className="px-4 py-3 bg-white dark:bg-gray-700 rounded-xl shadow hover:scale-[1.02] transition duration-200 text-gray-800 dark:text-gray-100 font-semibold"
          >
            Create Goal
          </button>
          <button
            type="button"
            onClick={() => navigate('/wallet')}
            className="px-4 py-3 bg-white dark:bg-gray-700 rounded-xl shadow hover:scale-[1.02] transition duration-200 text-gray-800 dark:text-gray-100 font-semibold"
          >
            Deposit Funds
          </button>
          <button
            type="button"
            onClick={() => navigate('/quiz')}
            className="px-4 py-3 bg-white dark:bg-gray-700 rounded-xl shadow hover:scale-[1.02] transition duration-200 text-gray-800 dark:text-gray-100 font-semibold"
          >
            Take Weekly Quiz
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-200 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Weekly Savings Chart</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last 7 days (cumulative)</p>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weeklySavingsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Saved']}
                contentStyle={{ borderRadius: '0.75rem', borderColor: '#e5e7eb' }}
              />
              <Line
                type="monotone"
                dataKey="savings"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 4, fill: '#8b5cf6' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-200 border border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-white dark:bg-gray-800 text-indigo-600 shadow-sm">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200">Nickle AI Coach</h3>
          </div>
          <p className="text-base text-indigo-900 dark:text-indigo-200 font-medium">You saved ${weeklySaved.toFixed(2)} this week.</p>
          <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-2">
            {goals.length === 0
              ? 'Create your first goal to receive AI recommendations.'
              : !nextGoal
                ? 'Amazing progress. You have completed all your current goals.'
                : projectedWeeks === null
                  ? `Start adding savings to reach your ${nextGoal.goal_name} goal.`
                  : `At this rate you will reach your ${nextGoal.goal_name} goal in ${projectedWeeks} weeks.`}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-200 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Leaderboard Rank
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">#{data.leaderboard_rank}</p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Global</p>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Keep your streak active to climb faster this week.</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
