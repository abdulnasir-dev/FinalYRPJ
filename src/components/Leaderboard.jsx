import React, { useState, useEffect } from "react";
import { getLeaderboard } from "../api/auth.api";

const FILTERS = ["weekly", "monthly", "yearly", "all"];

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await getLeaderboard(period);
        setLeaderboard(response.data.leaderboard || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Failed to sync leaderboard"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [period]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <p className="text-gray-500 animate-pulse">Loading rankings...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl">
          ⚠️ {error}
        </div>
      </div>
    );

  const topThree = leaderboard.slice(0, 3);
  const others = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-24">

      <div className="max-w-4xl mx-auto px-6">

        {/* HEADER */}
        <header className="pt-5 pb-14 text-center    ">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-800 via-teal-400 to-cyan-800 bg-clip-text text-transparent p-2">
            Top Ranking
          </h1>
          <p className="text-gray-500 mt-3 text-sm">
            Celebrating the highest contributors
          </p>

          <div className="mt-8 mb-8 inline-flex bg-white/80 backdrop-blur-md border border-slate-200 rounded-full p-1 shadow-md">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setPeriod(f)}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all capitalize ${
                  period === f
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {f === "all" ? "All Time" : f}
              </button>
            ))}
          </div>
        </header>

        {/* PODIUM */}
        <div className="flex justify-center items-end gap-12 mb-17">

          {/* Silver */}
          {topThree[1] && (
            <div className="flex flex-col items-center w-1/3 transition hover:scale-105">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full bg-white shadow-lg border border-emerald-200 flex items-center justify-center text-2xl font-bold">
                  {topThree[1].fullName?.[0]}
                </div>
                <span className="absolute -top-2 -right-2 bg-emerald-950 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  2
                </span>
              </div>
              <p className="font-semibold text-gray-800">
                {topThree[1].fullName}
              </p>
              <p className="text-teal-600 font-semibold text-sm mt-1">
                {topThree[1].totalPoints} pts
              </p>
            </div>
          )}

          {/* Gold */}
          {topThree[0] && (
            <div className="flex flex-col items-center w-1/3 -translate-y-10">
              <div className="relative mb-6">

                <div className="absolute inset-0 bg-emerald-400/20 blur-3xl rounded-full"></div>

                <div className="relative w-28 h-28 rounded-full bg-white border-2 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.25)] flex items-center justify-center text-4xl font-black">
                  {topThree[0].fullName?.[0]}
                </div>

                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs px-4 py-1 rounded-full font-semibold uppercase tracking-wide">
                  Top Expert
                </div>
              </div>

              <p className="text-lg font-bold text-gray-900">
                {topThree[0].fullName}
              </p>
              <p className="text-emerald-600 font-bold mt-1">
                {topThree[0].totalPoints} pts
              </p>
            </div>
          )}

          {/* Bronze */}
          {topThree[2] && (
            <div className="flex flex-col items-center w-1/3 transition hover:scale-105">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full bg-white shadow-lg border border-emerald-300 flex items-center justify-center text-2xl font-bold">
                  {topThree[2].fullName?.[0]}
                </div>
                <span className="absolute -top-2 -right-2 bg-emerald-900 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  3
                </span>
              </div>
              <p className="font-semibold text-gray-800">
                {topThree[2].fullName}
              </p>
              <p className="text-teal-600 font-semibold text-sm mt-1">
                {topThree[2].totalPoints} pts
              </p>
            </div>
          )}
        </div>

        {/* RANKING LIST */}
        <div className="rounded-3xl bg-white/70 backdrop-blur-xl shadow-xl border border-slate-200 overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-6 px-8 py-5 text-xs uppercase tracking-widest text-slate-400 font-semibold bg-gradient-to-r from-slate-50 to-white">
            <span className="col-span-1 text-emerald-800">Rank</span>
            <span className="col-span-3 text-emerald-800 ">User</span>
            <span className="col-span-2 text-emerald-800 text-right">Points</span>
          </div>

          {/* Rows */}
          <div>
            {others.map((user, index) => (
              <div
                key={user.userId}
                className={`grid grid-cols-6 items-center px-8 py-6 transition-all duration-200 group ${
                  index % 2 === 0 ? "bg-white/40" : "bg-transparent"
                } hover:bg-emerald-50/40 hover:shadow-inner`}
              >
                <span className="col-span-1 text-violet-950 font-mono text-sm">
                  {user.rank.toString().padStart(2, "0")}
                </span>

                <div className="col-span-3 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">
                    {user.fullName?.[0]}
                  </div>
                  <span className="font-semibold text-gray-800 group-hover:text-emerald-600 transition">
                    {user.fullName}
                  </span>
                </div>

                <div className="col-span-2 text-right font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                  {user.totalPoints.toLocaleString()} pts
                </div>
              </div>
            ))}
          </div>

          {leaderboard.length === 0 && (
            <div className="py-20 text-center text-slate-400">
              No leaderboard data available.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
