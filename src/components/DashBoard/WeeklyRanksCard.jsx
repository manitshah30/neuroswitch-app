import React from 'react';
import { useAuth } from '../../context/AuthContext';

// Helper to get a random color for the avatar
const colors = ['bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-blue-500', 'bg-red-500'];
const getRandomColor = (index) => colors[index % colors.length];

function WeeklyRanksCard({ players }) {
  const { currentUser } = useAuth();

  // A check to handle the loading state before players data is available
  if (!players || players.length === 0) {
    return (
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg h-full">
        <h3 className="text-xl font-bold text-white mb-6">Weekly Ranks</h3>
        <p className="text-gray-400">Loading leaderboard...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg h-full">
      <h3 className="text-xl font-bold text-white mb-6">Weekly Ranks</h3>
      <div className="space-y-4">
        {players.map((player, index) => {
          const isCurrentUser = player.userId === currentUser?.$id;
          const name = isCurrentUser ? 'You' : player.name;
          const initial = name.charAt(0).toUpperCase();
          
          return (
            <div key={player.userId} className={`flex items-center justify-between p-3 rounded-lg ${isCurrentUser ? 'bg-purple-500/20' : ''}`}>
              <div className="flex items-center gap-4">
                <span className="font-bold text-gray-400 text-lg w-6">{index + 1}.</span>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${getRandomColor(index)}`}>
                  {initial}
                </div>
                <span className={`font-semibold ${isCurrentUser ? 'text-white' : 'text-gray-300'}`}>
                  {name}
                </span>
              </div>
              <span className="font-bold text-yellow-400">{player.xp.toLocaleString()} XP</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeeklyRanksCard;
