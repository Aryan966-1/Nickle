import React from 'react';

export type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyBadgeProps {
  difficulty?: Difficulty | string;
}

const DIFFICULTY_STYLES: Record<Difficulty, string> = {
  easy: 'bg-teal-100 text-teal-700 border border-teal-200',
  medium: 'bg-amber-100 text-amber-700 border border-amber-200',
  hard: 'bg-rose-100 text-rose-700 border border-rose-200'
};

const normalizeDifficulty = (difficulty?: Difficulty | string): Difficulty => {
  if (difficulty === 'easy' || difficulty === 'hard' || difficulty === 'medium') {
    return difficulty;
  }
  return 'medium';
};

const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty }) => {
  const normalizedDifficulty = normalizeDifficulty(difficulty);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${DIFFICULTY_STYLES[normalizedDifficulty]}`}
    >
      {normalizedDifficulty}
    </span>
  );
};

export default DifficultyBadge;
