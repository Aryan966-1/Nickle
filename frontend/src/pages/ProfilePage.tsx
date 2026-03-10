import React from 'react';
import { User, Mail, Shield, Star, Coins, Flame, CalendarDays } from 'lucide-react';

interface NickleUser {
  name?: string;
  email?: string;
  level?: number;
  xp?: number;
  coins?: number;
  streak?: number;
  created_at?: string;
  member_since?: string;
}

const ProfilePage = () => {
  const user: NickleUser = JSON.parse(localStorage.getItem('nickle_user') || '{}');

  const memberSinceRaw = user.member_since || user.created_at;
  const memberSince = memberSinceRaw
    ? new Date(memberSinceRaw).toLocaleDateString()
    : 'Not available';

  const profileRows = [
    { label: 'User name', value: user.name || 'Not available', icon: User },
    { label: 'Email', value: user.email || 'Not available', icon: Mail },
    { label: 'Level', value: user.level ?? 'Not available', icon: Shield },
    { label: 'XP', value: user.xp ?? 'Not available', icon: Star },
    { label: 'Coins', value: user.coins ?? 'Not available', icon: Coins },
    { label: 'Current streak', value: user.streak ?? 'Not available', icon: Flame },
    { label: 'Member since', value: memberSince, icon: CalendarDays }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Profile</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:scale-[1.02] transition duration-200">
        <div className="space-y-4">
          {profileRows.map((row) => {
            const Icon = row.icon;
            return (
              <div
                key={row.label}
                className="flex items-center justify-between gap-3 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{row.label}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 text-right">{row.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
