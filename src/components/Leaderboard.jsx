import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../api/auth.api';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await getLeaderboard('all');
        setLeaderboard(response.data.leaderboard || []);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.response?.data?.message || "Failed to sync with Impact Hub");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center">
      <div className="animate-bounce flex space-x-2">
        <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
        <div className="h-3 w-3 bg-indigo-400 rounded-full"></div>
        <div className="h-3 w-3 bg-indigo-300 rounded-full"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center p-6">
      <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 font-mono text-sm">
        ⚠️ {error}
      </div>
    </div>
  );

  const topThree = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 pb-20 font-sans selection:bg-indigo-500/30">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Header Section */}
        <header className="text-center pt-12 pb-16">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            Community Rankings
          </h1>
          <p className="text-slate-500 text-sm mt-3 font-medium uppercase tracking-widest">
            Impact Hub Top Contributors
          </p>
        </header>

        {/* Podium Section */}
        <div className="flex justify-center items-end gap-2 sm:gap-6 mb-16 h-64">
          {/* Silver - Rank 2 */}
          {topThree[1] && (
            <div className="flex flex-col items-center w-1/3 group">
              <div className="relative mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-800 border-2 border-slate-400/30 flex items-center justify-center text-2xl font-bold shadow-xl">
                  {topThree[1].fullName?.[0]}
                </div>
                <div className="absolute -top-2 -right-1 bg-slate-400 text-slate-900 text-[10px] h-6 w-6 rounded-full flex items-center justify-center font-bold ring-4 ring-[#0b0e14]">2</div>
              </div>
              <p className="text-sm font-bold truncate w-full text-center">{topThree[1].fullName}</p>
              <p className="text-indigo-400 text-xs font-mono mt-1">{topThree[1].totalPoints} PTS</p>
            </div>
          )}

          {/* Gold - Rank 1 */}
          {topThree[0] && (
            <div className="flex flex-col items-center w-1/3 -translate-y-6 transform transition-transform hover:scale-105">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full"></div>
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-800 border-2 border-yellow-500 flex items-center justify-center text-4xl font-black shadow-[0_0_30px_rgba(234,179,8,0.15)]">
                  {topThree[0].fullName?.[0]}
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter">Champion</div>
              </div>
              <p className="text-base font-black truncate w-full text-center text-white">{topThree[0].fullName}</p>
              <p className="text-yellow-500 text-sm font-mono mt-1 font-bold">{topThree[0].totalPoints} PTS</p>
            </div>
          )}

          {/* Bronze - Rank 3 */}
          {topThree[2] && (
            <div className="flex flex-col items-center w-1/3">
              <div className="relative mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-800 border-2 border-amber-700/30 flex items-center justify-center text-2xl font-bold shadow-xl">
                  {topThree[2].fullName?.[0]}
                </div>
                <div className="absolute -top-2 -right-1 bg-amber-700 text-white text-[10px] h-6 w-6 rounded-full flex items-center justify-center font-bold ring-4 ring-[#0b0e14]">3</div>
              </div>
              <p className="text-sm font-bold truncate w-full text-center">{topThree[2].fullName}</p>
              <p className="text-indigo-400 text-xs font-mono mt-1">{topThree[2].totalPoints} PTS</p>
            </div>
          )}
        </div>

        {/* List Section */}
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-sm">
          <div className="grid grid-cols-6 px-6 py-4 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold bg-white/5">
            <span className="col-span-1">Rank</span>
            <span className="col-span-3">Impact Maker</span>
            <span className="col-span-2 text-right">Reputation</span>
          </div>

          <div className="divide-y divide-white/5">
            {others.map((user) => (
              <div key={user.userId} className="grid grid-cols-6 items-center px-6 py-5 hover:bg-white/[0.02] transition-colors group">
                <span className="col-span-1 text-slate-500 font-mono text-sm group-hover:text-indigo-400 transition-colors">
                  {user.rank.toString().padStart(2, '0')}
                </span>
                
                <div className="col-span-3 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-300 uppercase shadow-inner">
                    {user.fullName?.[0]}
                  </div>
                  <span className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors truncate">
                    {user.fullName}
                  </span>
                </div>

                <div className="col-span-2 text-right">
                  <span className="text-white font-mono font-bold tabular-nums">
                    {user.totalPoints.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-600 ml-2 font-bold tracking-tighter">PTS</span>
                </div>
              </div>
            ))}
          </div>

          {leaderboard.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-600 italic text-sm">No activity recorded for this period.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;