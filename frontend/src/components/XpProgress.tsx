import React from 'react';
import { Star } from 'lucide-react';

const XP_LEVELS = [0, 100, 300, 600, 1000, 1500, 2100];

interface XpProgressProps {
  xp: number;
  level: number;
  embedded?: boolean;
}

const XpProgress: React.FC<XpProgressProps> = ({ xp, level, embedded = false }) => {
  const levelIndex = Math.min(Math.max(level - 1, 0), XP_LEVELS.length - 2);
  const currentLevelXp = XP_LEVELS[levelIndex];
  const nextLevelXp = XP_LEVELS[levelIndex + 1];
  const levelSpan = Math.max(nextLevelXp - currentLevelXp, 1);
  const progress = Math.min(100, Math.max(0, ((xp - currentLevelXp) / levelSpan) * 100));
  const xpToNextLevel = Math.max(nextLevelXp - xp, 0);
  const nextLevelLabel = levelIndex + 2;
  const containerClass = embedded
    ? ''
    : 'bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-[1.02] transition duration-200 border border-gray-100 dark:border-gray-700';

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">XP Progress</h3>
        </div>
        <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">Level {level}</span>
      </div>

      <div className="flex items-baseline justify-between mb-2">
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{xp} XP</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {xpToNextLevel} XP to Level {nextLevelLabel}
        </p>
      </div>

      <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default XpProgress;
