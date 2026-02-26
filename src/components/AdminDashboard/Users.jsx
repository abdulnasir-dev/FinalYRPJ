import { banningUsers, getAdminUsersList } from "@/api/admin.users";
import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { LoaderOne } from "../ui/loader";
import toast from "react-hot-toast";

const BAN_PRESETS = [
  { label: "1 Hour", value: 1 },
  { label: "6 Hours", value: 6 },
  { label: "12 Hours", value: 12 },
  { label: "1 Day", value: 24 },
  { label: "3 Days", value: 72 },
  { label: "1 Week", value: 168 },
  { label: "Custom", value: "custom" },
];

const BanModal = ({ user, onClose, onBanned }) => {
  const [banTime, setBanTime] = useState("");
  const [customHours, setCustomHours] = useState("");
  const [reason, setReason] = useState("");
  const [banning, setBanning] = useState(false);

  const handleBan = async () => {
    const hours = banTime === "custom" ? Number(customHours) : Number(banTime);
    if (!hours || hours <= 0) return toast.error("Select a valid duration");
    if (!reason.trim()) return toast.error("Please provide a reason");

    try {
      setBanning(true);
      await toast.promise(banningUsers(user._id, hours, reason.trim()), {
        loading: "Banning user...",
        success: "User banned successfully",
        error: "Failed to ban user",
      });
      onBanned();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setBanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-5">

        <div>
          <h2 className="text-lg font-bold text-gray-900">Ban User</h2>
          <p className="text-sm text-gray-500 mt-1">
            Banning <span className="font-semibold text-gray-800">{user.fullName || user.email}</span>
          </p>
        </div>

        {/* Duration Presets */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Duration</label>
          <div className="flex flex-wrap gap-2">
            {BAN_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => { setBanTime(preset.value); setCustomHours(""); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${banTime === preset.value
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-700 border-gray-300 hover:border-black"
                  }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {banTime === "custom" && (
            <input
              type="number"
              min={1}
              placeholder="Enter number of hours"
              value={customHours}
              onChange={(e) => setCustomHours(e.target.value)}
              className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-black focus:outline-none"
            />
          )}
        </div>

        {/* Reason */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Reason</label>
          <textarea
            rows={3}
            placeholder="Why is this user being banned?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm resize-none focus:ring-2 focus:ring-black focus:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-300 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleBan}
            disabled={banning}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
          >
            {banning ? "Banning..." : "Confirm Ban"}
          </button>
        </div>

      </div>
    </div>
  );
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 8;
  const [totalUsers, setTotalUsers] = useState(0);
  const [proUsers, setProUsers] = useState(0);
  const [admins, setAdmins] = useState(0);
  const [banModalUser, setBanModalUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminUsersList(page, limit);
      setUsers(res.data.users);
      setTotalUsers(res.data.count);
      setProUsers(res.data.proUsers);
      setAdmins(res.data.admins);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const getRemainingTime = (banExpiresAt) => {
    const diff = new Date(banExpiresAt) - new Date();
    if (diff <= 0) return null;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderOne />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">

      {banModalUser && (
        <BanModal
          user={banModalUser}
          onClose={() => setBanModalUser(null)}
          onBanned={fetchUsers}
        />
      )}

      {/* HEADER */}
      <div className="p-1 flex flex-col gap-2">
        <h1 className="text-2xl font-bold">USERS</h1>
        <p className="text-stone-600">Manage and review all registered users.</p>
      </div>

      {/* STATS BOXES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-black text-white rounded-xl px-6 py-4">
          <p className="text-sm opacity-70">Total Users</p>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-blue-600 text-white rounded-xl px-6 py-4">
          <p className="text-sm opacity-70">Admins</p>
          <p className="text-2xl font-bold">{admins}</p>
        </div>
        <div className="bg-green-600 text-white rounded-xl px-6 py-4">
          <p className="text-sm opacity-70">Pro Users</p>
          <p className="text-2xl font-bold">{proUsers}</p>
        </div>
      </div>

      {/* LIST CONTAINER */}
      <div className="bg-white rounded-xl w-full py-3 px-4 flex flex-col gap-4 border-2 border-gray-300">

        {/* TOP BAR */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3 items-center p-1">
            <h1 className="text-base md:text-lg font-bold">User List -</h1>
            <div className="h-5 w-5 bg-black text-white rounded-full flex justify-center items-center text-xs">
              {users.length}
            </div>
          </div>
          <FaFilter size={20} className="md:w-6 md:h-6" />
        </div>

        {/* USERS LIST */}
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-md w-full py-3 px-3 md:px-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3 border-2 border-gray-300"
          >
            {/* LEFT */}
            <div className="flex flex-col gap-1 flex-1">
              <h3 className="text-base font-semibold text-gray-800">
                {user.fullName || user.email}
              </h3>
              <p className="text-xs text-gray-500">
                Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-gray-500">{user.email}</p>

              {user.isBanned && user.banReason && (
                <p className="text-xs text-red-500 mt-1">
                  Reason: {user.banReason}
                </p>
              )}

              <div className="flex gap-2 flex-wrap mt-1">
                {user.admin && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    Admin
                  </span>
                )}
                {user.isPro && (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Pro
                  </span>
                )}
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              <button
                className="bg-black text-white px-3 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-gray-800 transition"
                onClick={() => setBanModalUser(user)}
                disabled={user.isBanned}
              >
                {user.isBanned
                  ? `Banned (${getRemainingTime(user.banExpiresAt) || "expired"})`
                  : "Ban User"}
              </button>
            </div>
          </div>
        ))}

        {/* PAGINATION */}
        <div className="flex justify-between items-center pt-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 text-sm font-semibold rounded-lg border disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm font-semibold">Page {page}</span>
          <button
            disabled={users.length < limit}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 text-sm font-semibold rounded-lg border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;