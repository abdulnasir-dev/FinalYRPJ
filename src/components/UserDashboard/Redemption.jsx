import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import {requestRedemption, myPoints, fetchMyRedemptions } from "../../api/userDashboard";

const Redemption = () => {
  const [availablePoints, setAvailablePoints] = useState(0);
  const [redeemed, setRedeemed] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pointsRes, redemptionRes] = await Promise.all([
          myPoints(),
          fetchMyRedemptions(),
        ]);

        setAvailablePoints(pointsRes.data.availablePoints);
        setRedeemed(redemptionRes.data.redeemed);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleRedeem = async (points) => {
    if (!window.confirm(`Redeem ${points} points for a gift card?`)) return;

    try {
      setLoading(true);
      const res = await requestRedemption({ points });

      setAvailablePoints(res.data.availablePoints);
      setRedeemed((prev) => [res.data.redemption, ...prev]);
    } catch (error) {
      alert(error.response?.data?.message || "Redemption failed");
    } finally {
      setLoading(false);
    }
  };

  const hasPending = redeemed.some((r) => r.status === "pending");

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="p-1 flex flex-col gap-2">
        <h1 className="text-2xl font-bold">REDEMPTIONS</h1>
        <p className="text-stone-600">
          Redeem your points for rewards and track redemption history.
        </p>
      </div>

      {/* Available points */}
      <div className="bg-black text-white rounded-xl px-6 py-4 flex justify-between items-center">
        <div>
          <p className="text-sm opacity-70">Available Points</p>
          <p className="text-2xl font-bold">{availablePoints}</p>
        </div>
      </div>

      {/* Redeem options */}
      <div className="bg-white rounded-xl border-2 border-gray-300 p-4 flex flex-col gap-4">
        <h2 className="text-lg font-bold">Redeem Points</h2>

        <div className="flex gap-4 flex-wrap">
          {[500, 1000].map((points) => (
            <button
              key={points}
              disabled={
                loading ||
                hasPending ||
                availablePoints < points
              }
              onClick={() => handleRedeem(points)}
              className={`px-5 py-3 rounded-lg font-semibold text-sm transition
                ${availablePoints >= points && !hasPending
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              Redeem {points} pts
            </button>
          ))}
        </div>

        {hasPending && (
          <p className="text-sm text-orange-600">
            You already have a pending redemption request.
          </p>
        )}
      </div>

      {/* Redemption history */}
      <div className="bg-white rounded-xl w-full py-3 px-4 flex flex-col gap-4 border-2 border-gray-300">
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <h2 className="text-base md:text-lg font-bold">
              Redemption History -
            </h2>
            <div className="h-5 w-5 bg-black text-white rounded-full flex justify-center items-center text-xs">
              {redeemed.length}
            </div>
          </div>

          <FaFilter size={20} />
        </div>

        {redeemed.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-md w-full py-4 px-3 md:px-4 flex justify-between items-center border-2 border-gray-300"
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold">
                Gift Card Redemption
              </p>
              <p className="text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="font-bold text-red-600">
                -{item.points} pts
              </span>
              <span
                className={`text-xs font-semibold ${item.status === "approved"
                  ? "text-green-600"
                  : item.status === "pending"
                    ? "text-orange-500"
                    : "text-red-600"
                  }`}
              >
                {item.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}

        {redeemed.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-6">
            No redemption history yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Redemption;
