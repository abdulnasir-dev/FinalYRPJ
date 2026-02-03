import { getAdminUsersList } from "@/api/admin.users";
import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { LoaderOne } from "../ui/loader";
// import { LoaderOne } from "../ui/loader";
// import { getAdminUsersList } from "../../api/admin.users.list";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const limit = 8;

  const [totalUsers, setTotalUsers] = useState(0);
  const [proUsers, setProUsers] = useState(0);
  const [admins, setAdmins] = useState(0);

  useEffect(() => {
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

    fetchUsers();
  }, [page]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderOne />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* HEADER */}
      <div className="p-1 flex flex-col gap-2">
        <h1 className="text-2xl font-bold">USERS</h1>
        <p className="text-stone-600">
          Manage and review all registered users.
        </p>
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
            <h1 className="text-base md:text-lg font-bold">
              User List -
            </h1>
            <div className="h-5 w-5 bg-black text-white rounded-full flex justify-center items-center text-xs">
              {users.length}
            </div>
          </div>

          <FaFilter size={20} className="md:w-6 md:h-6" />
        </div>

        {/* USERS LIST */}
        {users.map((user, index) => (
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
              <span className="text-xs text-gray-600">
                {user.email}
              </span>
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
