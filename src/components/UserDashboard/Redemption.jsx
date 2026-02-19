import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import {
  requestRedemption,
  myPoints,
  fetchMyRedemptions,
} from "../../api/userDashboard";
import { LoaderOne } from "../ui/loader";

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

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderOne />
      </div>
    );
  }

  const hasPending = redeemed.some((r) => r.status === "pending");

  return (
    <div className="flex flex-col gap-8 h-full bg-gradient-to-br from-slate-50 to-white p-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-7">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-emerald-900 to-teal-400 bg-clip-text text-transparent">
          Redemptions
        </h1>
        <p className="text-slate-500 text-sm mt-3">
          Convert your earned points into rewards and track redemption history.
        </p>
      </div>

      {/* AVAILABLE POINTS CARD */}
      <div className="rounded-2xl px-8 py-6 bg-gradient-to-r from-emerald-700 to-teal-600 text-white shadow-lg flex justify-between items-center">
        <div>
          <p className="text-sm opacity-80">Available Points</p>
          <p className="text-3xl font-bold tracking-tight">
            {availablePoints}
          </p>
        </div>
      </div>

      {/* REDEEM OPTIONS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 flex flex-col gap-6">

        <h2 className="text-lg font-semibold text-slate-800">
          Redeem Points
        </h2>

        <div className="flex gap-5 flex-wrap">
          {[500, 1000].map((points) => {
            const isDisabled =
              loading || hasPending || availablePoints < points;

            return (
              <button
                key={points}
                disabled={isDisabled}
                onClick={() => handleRedeem(points)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                  ${
                    !isDisabled
                      ? "bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
              >
                Redeem {points} pts
              </button>
            );
          })}
        </div>

        {hasPending && (
          <p className="text-sm text-orange-600">
            You already have a pending redemption request.
          </p>
        )}
      </div>

      {/* REDEMPTION HISTORY */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 flex flex-col gap-6">

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Redemption History
            </h2>
            <span className="px-3 py-1 text-xs font-semibold bg-slate-900 text-white rounded-full">
              {redeemed.length}
            </span>
          </div>
          <FaFilter size={18} className="text-slate-400" />
        </div>

        {redeemed.length === 0 && (
          <div className="text-center text-slate-400 text-sm py-10">
            No redemption history yet.
          </div>
        )}

        {redeemed.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center p-5 border border-slate-200 rounded-xl hover:shadow-md transition"
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-slate-900">
                Gift Card Redemption
              </p>
              <p className="text-xs text-slate-500">
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
                className={`text-xs font-semibold uppercase tracking-wide ${
                  item.status === "approved"
                    ? "text-emerald-600"
                    : item.status === "pending"
                    ? "text-orange-500"
                    : "text-red-600"
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Redemption;
