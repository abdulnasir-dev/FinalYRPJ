import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { myPoints } from "../../api/userDashboard";

const typeLabelMap = {
  commented: "Commented on a solution",
  solution_accepted: "Solution Accepted",
  reported: "Reported a solution",
};

const Rewards = () => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await myPoints();
        setSummary(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPoints();
  }, []);

  if (!summary) {
    return <p className="text-center text-gray-500">Loading rewards...</p>;
  }

  const {
    totalPoints,
    availablePoints,
    redeemedPoints,
    reputationRecords,
  } = summary;

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="p-1 flex flex-col gap-2">
        <h1 className="text-2xl font-bold">REWARDS & POINTS</h1>
        <p className="text-stone-600">
          Track how your actions affect your reputation and points.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-black text-white rounded-xl px-6 py-4">
          <p className="text-sm opacity-70">Total Points</p>
          <p className="text-2xl font-bold">{totalPoints}</p>
        </div>

        <div className="bg-green-600 text-white rounded-xl px-6 py-4">
          <p className="text-sm opacity-70">Available</p>
          <p className="text-2xl font-bold">{availablePoints}</p>
        </div>

        <div className="bg-gray-200 text-gray-900 rounded-xl px-6 py-4">
          <p className="text-sm opacity-70">Redeemed</p>
          <p className="text-2xl font-bold">{redeemedPoints}</p>
        </div>
      </div>

      {/* Activity container */}
      <div className="bg-white rounded-xl w-full py-3 px-4 flex flex-col gap-4 border-2 border-gray-300">
        {/* Top bar */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center p-1">
            <h1 className="text-base md:text-lg font-bold">
              Points Activity -
            </h1>
            <div className="h-5 w-5 bg-black text-white rounded-full flex justify-center items-center text-xs">
              {reputationRecords.length}
            </div>
          </div>

          <FaFilter size={20} className="md:w-6 md:h-6" />
        </div>

        {/* List */}
        {reputationRecords.map((record) => (
          <div
            key={record._id}
            className="bg-white rounded-md w-full py-4 px-3 md:px-4 flex flex-col gap-3 border-2 border-gray-300"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <h2 className="text-sm md:text-base font-semibold text-gray-800">
                  {typeLabelMap[record.type] || record.type}
                </h2>

                {record.solutionId?.answer ? (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    “{record.solutionId.answer}”
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 italic">
                    No linked solution
                  </p>
                )}
              </div>

              <div
                className={`text-sm md:text-base font-bold ${record.points >= 0
                    ? "text-green-600"
                    : "text-red-600"
                  }`}
              >
                {record.points > 0 ? "+" : ""}
                {record.points} pts
              </div>
            </div>

            <div className="text-xs md:text-sm text-gray-500">
              {new Date(record.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        ))}

        {reputationRecords.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-6">
            No points activity yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Rewards;
