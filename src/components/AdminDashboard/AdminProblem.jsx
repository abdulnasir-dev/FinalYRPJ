import { getAllProblems, toggleProblemVisibility } from "@/api/admin.users";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LoaderOne } from "../ui/loader";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 9;

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
  const navigate = useNavigate()

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await getAllProblems();
      const data = res?.data?.problems || [];
      // console.log(res.data)
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentProblems.map((problem) => (
            <div
              key={problem._id}
              className="rounded-xl border border-gray-400 p-4 bg-white hover:border-gray-300 transition"
            >
              {/* HEADER */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {problem.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Created by{" "}
                    <span className="font-medium text-gray-700">
                      {problem.createdBy?.fullName || "Unknown User"}
                    </span>
                  </p>
                </div>

                {/* ENTITY TYPE / STATUS */}
                <span className="text-[11px] px-2 py-[2px] rounded-md border border-gray-200 text-gray-600 whitespace-nowrap">
                  Problem
                </span>
              </div>

              {/* DIVIDER */}
              <div className="my-3 h-[1px] bg-gray-100 rounded" />

              {/* META ROW */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {new Date(problem.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                <span className="italic">
                  Entity ID: {problem._id}
                </span>
              </div>

              {/* TAGS */}
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                <span className="border border-gray-200 rounded px-2 py-[2px] text-gray-600">
                  {problem.category}
                </span>

                <span className="border border-green-200 rounded px-2 py-[2px] text-green-700">
                  {problem.expertCategory}
                </span>

                <span
                  className={`border rounded px-2 py-[2px]
            ${problem.isDeleted
                      ? "border-red-300 text-red-600"
                      : "border-green-300 text-green-600"}
          `}
                >
                  {problem.isDeleted ? "Hidden" : "Visible"}
                </span>

                {problem.isPinned && (
                  <span className="border border-purple-300 rounded px-2 py-[2px] text-purple-600">
                    Pinned
                  </span>
                )}
              </div>

              {/* ACTION */}
              <div className="flex gap-3">
                <button
                  disabled={updatingId === problem._id}
                  onClick={() => handleToggleVisibility(problem._id)}
                  className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition
                   ${problem.isDeleted
                      ? "border-green-400 text-green-700 hover:bg-green-50"
                      : "border-red-400 text-red-700 hover:bg-red-50"}
                      ${updatingId === problem._id && "opacity-50 cursor-not-allowed"}
                     `}
                >
                  {problem.isDeleted ? <FaEye /> : <FaEyeSlash />}
                  {problem.isDeleted ? "Restore" : "Hide"}
                </button>

                <button onClick={()=> navigate(`/problems/${problem._id}`)} className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition">View Problem</button>
              </div>
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
