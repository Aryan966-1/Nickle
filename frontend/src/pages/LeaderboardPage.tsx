import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import api from '../services/api';

interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
}

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/leaderboard');
        setLeaderboard(response.data);
      } catch (err: any) {
        setError('Failed to load leaderboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-xl leading-none">{'\u{1F947}'}</span>;
      case 2:
        return <span className="text-xl leading-none">{'\u{1F948}'}</span>;
      case 3:
        return <span className="text-xl leading-none">{'\u{1F949}'}</span>;
      default:
        return <span className="text-gray-500 dark:text-gray-400 font-bold w-6 text-center">{rank}</span>;
    }
  };

  const getRowClass = (rank: number) => {
    if (rank === 1) return 'bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-500';
    if (rank === 2) return 'bg-gray-50 dark:bg-gray-800/50 border-l-4 border-gray-400';
    if (rank === 3) return 'bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-600';
    return 'hover:bg-gray-50 dark:hover:bg-gray-800 border-l-4 border-transparent';
  };

  if (loading) {
     return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Global Leaderboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Top savers ranked by Experience Points (XP)
          </p>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm">
          {error}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Rank</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300">Saver</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">XP Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-gray-500 dark:text-gray-400">
                      No leaderboard data yet. Start saving to secure your spot!
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((entry) => (
                    <tr key={entry.rank} className={`transition-colors ${getRowClass(entry.rank)}`}>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center justify-center w-8">
                          {getRankDisplay(entry.rank)}
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {entry.name}
                        </span>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <span className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400">
                          {entry.xp} <span className="text-xs font-normal text-indigo-400">XP</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;

