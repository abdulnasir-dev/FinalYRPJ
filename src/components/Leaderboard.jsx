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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-bounce flex space-x-2">
        <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
        <div className="h-3 w-3 bg-indigo-400 rounded-full"></div>
        <div className="h-3 w-3 bg-indigo-300 rounded-full"></div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-600 text-sm">
        ⚠️ {error}
      </div>
    </div>
  );

  const topThree = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pb-20 font-sans">

      <div className="max-w-2xl mx-auto px-4">

        {/* Header */}
        <header className="text-center pt-12 pb-16">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-b from-gray-900 to-gray-500 bg-clip-text text-transparent">
            Community Rankings
          </h1>
          <p className="text-gray-500 text-sm mt-3 font-medium uppercase tracking-widest">
            Impact Hub Top Contributors
          </p>
        </header>

        {/* Podium */}
        <div className="flex justify-center items-end gap-6 mb-16 h-64">

          {/* Silver */}
          {topThree[1] && (
            <div className="flex flex-col items-center w-1/3">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full bg-white border border-gray-200 flex items-center justify-center text-2xl font-bold shadow-sm">
                  {topThree[1].fullName?.[0]}
                </div>
                <div className="absolute -top-2 -right-1 bg-gray-400 text-white text-[10px] h-6 w-6 rounded-full flex items-center justify-center font-bold">2</div>
              </div>
              <p className="text-sm font-bold truncate w-full text-center">{topThree[1].fullName}</p>
              <p className="text-indigo-600 text-xs font-mono mt-1">{topThree[1].totalPoints} PTS</p>
            </div>
          )}

          {/* Gold */}
          {topThree[0] && (
            <div className="flex flex-col items-center w-1/3 -translate-y-6">
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full bg-white border-2 border-yellow-500 flex items-center justify-center text-4xl font-black shadow-md">
                  {topThree[0].fullName?.[0]}
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-[10px] px-3 py-1 rounded-full font-black uppercase">
                  Champion
                </div>
              </div>
              <p className="text-base font-black truncate w-full text-center">{topThree[0].fullName}</p>
              <p className="text-yellow-600 text-sm font-mono mt-1 font-bold">{topThree[0].totalPoints} PTS</p>
            </div>
          )}

          {/* Bronze */}
          {topThree[2] && (
            <div className="flex flex-col items-center w-1/3">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full bg-white border border-amber-300 flex items-center justify-center text-2xl font-bold shadow-sm">
                  {topThree[2].fullName?.[0]}
                </div>
                <div className="absolute -top-2 -right-1 bg-amber-600 text-white text-[10px] h-6 w-6 rounded-full flex items-center justify-center font-bold">3</div>
              </div>
              <p className="text-sm font-bold truncate w-full text-center">{topThree[2].fullName}</p>
              <p className="text-indigo-600 text-xs font-mono mt-1">{topThree[2].totalPoints} PTS</p>
            </div>
          )}

        </div>

        {/* Ranking List */}
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">

          <div className="grid grid-cols-6 px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-bold bg-gray-50">
            <span className="col-span-1">Rank</span>
            <span className="col-span-3">Impact Maker</span>
            <span className="col-span-2 text-right">Reputation</span>
          </div>

          <div className="divide-y divide-gray-100">
            {others.map((user) => (
              <div key={user.userId} className="grid grid-cols-6 items-center px-6 py-5 hover:bg-gray-50 transition-colors">

                <span className="col-span-1 text-gray-500 font-mono text-sm">
                  {user.rank.toString().padStart(2, '0')}
                </span>

                <div className="col-span-3 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 uppercase">
                    {user.fullName?.[0]}
                  </div>
                  <span className="font-semibold text-sm truncate">
                    {user.fullName}
                  </span>
                </div>

                <div className="col-span-2 text-right">
                  <span className="font-mono font-bold">
                    {user.totalPoints.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-400 ml-2 font-bold">PTS</span>
                </div>

              </div>
            ))}
          </div>

          {leaderboard.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-400 italic text-sm">
                No activity recorded for this period.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
