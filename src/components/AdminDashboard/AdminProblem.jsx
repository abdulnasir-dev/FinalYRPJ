import { getAllProblems, toggleProblemVisibility } from "@/api/admin.users";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LoaderOne } from "../ui/loader";

const ITEMS_PER_PAGE = 6;

const statusStyles = {
  open: "bg-amber-100 text-amber-700",
  solved: "bg-green-100 text-green-700",
  closed: "bg-gray-200 text-gray-700",
};

const AdminProblem = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [page, setPage] = useState(1);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await getAllProblems();
      const data = res?.data?.problems || [];
      setProblems(data);
      setPage(1); // reset page on refetch
    } catch (err) {
      console.error("Failed to fetch problems", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  const handleToggleVisibility = async (problemId) => {
    try {
      setUpdatingId(problemId);
      await toggleProblemVisibility(problemId);
      await fetchProblems();
    } catch (err) {
      console.error("Toggle failed", err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderOne />
      </div>
    );
  }

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(problems.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentProblems = problems.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* HEADER */}
      <div className="p-1 flex flex-col gap-2">
        <h1 className="text-2xl font-bold">ALL PROBLEMS</h1>
        <p className="text-stone-600">
          Admin control panel for platform problems.
        </p>
      </div>

      {/* GRID CONTAINER */}
      <div className="bg-white rounded-xl w-full py-4 px-4 flex flex-col gap-6 border-2 border-gray-300">

        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold">Problems</h2>
          <span className="h-5 w-5 bg-black text-white rounded-full flex items-center justify-center text-xs">
            {problems.length}
          </span>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentProblems.map((problem) => (
            <div
              key={problem._id}
              className="bg-white rounded-xl p-4 flex flex-col justify-between gap-4 border-2 border-gray-300"
            >
              {/* TOP */}
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
                  {problem.title}
                </h3>

                {/* BADGES */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span
                    className={`px-2 py-1 rounded-full font-semibold ${statusStyles[problem.status] || "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {problem.status}
                  </span>

                  <span
                    className={`px-2 py-1 rounded-full font-semibold ${problem.isDeleted
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                      }`}
                  >
                    {problem.isDeleted ? "Hidden" : "Visible"}
                  </span>

                  {problem.isPinned && (
                    <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-semibold">
                      Pinned
                    </span>
                  )}

                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                    {problem.views} views
                  </span>
                </div>

                {/* CATEGORIES */}
                <div className="flex gap-2 text-xs text-gray-600">
                  <span className="px-2 py-1 rounded bg-gray-100">
                    {problem.category}
                  </span>
                  <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                    {problem.expertCategory}
                  </span>
                </div>

                {/* CREATED INFO */}
                <div className="text-xs text-gray-500 flex flex-col gap-1">
                  <span>
                    Created by{" "}
                    <span className="font-semibold text-gray-700">
                      {problem.createdBy?.fullName || "Unknown User"}
                    </span>
                    {problem.createdBy?.role && (
                      <span className="ml-2 px-2 py-[2px] rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-semibold uppercase">
                        {problem.createdBy.role}
                      </span>
                    )}
                  </span>

                  <span>
                    {new Date(problem.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* ACTION */}
              <button
                disabled={updatingId === problem._id}
                onClick={() => handleToggleVisibility(problem._id)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition
                  ${problem.isDeleted
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                  }
                  ${updatingId === problem._id &&
                  "opacity-50 cursor-not-allowed"
                  }
                `}
              >
                {problem.isDeleted ? (
                  <>
                    <FaEye /> Show
                  </>
                ) : (
                  <>
                    <FaEyeSlash /> Hide
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {problems.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-6">
            No problems found.
          </p>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 text-sm font-semibold rounded-lg border disabled:opacity-50"
            >
              Prev
            </button>

            <span className="text-sm font-semibold">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-sm font-semibold rounded-lg border disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProblem;
