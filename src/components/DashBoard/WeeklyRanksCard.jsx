import React from 'react';

function WeeklyRanksCard() {
  // Mock data for the leaderboard
  const ranks = [
    { rank: 1, initial: 'A', name: 'You', xp: '1,250 XP', color: 'bg-purple-500', isUser: true },
    { rank: 2, initial: 'S', name: 'SYZ', xp: '1,250 XP', color: 'bg-green-500' },
    { rank: 3, initial: 'M', name: 'MXT', xp: '1,250 XP', color: 'bg-orange-500' },
  ];

  return (
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-lg h-full">
      <h3 className="text-xl font-bold text-white mb-6">Weekly Ranks</h3>
      <div className="space-y-4">
        {ranks.map(player => (
          <div key={player.rank} className="flex items-center justify-between p-2 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-400 text-lg w-6">{player.rank}.</span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${player.color}`}>
                {player.initial}
              </div>
              <span className={`font-semibold ${player.isUser ? 'text-white' : 'text-gray-300'}`}>
                {player.name}
              </span>
            </div>
            <span className="font-bold text-yellow-400">{player.xp}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeeklyRanksCard;