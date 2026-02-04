import { getAllSolutions, toggleProblemVisibility, toggleSolutionVisibility } from "@/api/admin.users";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LoaderOne } from "../ui/loader";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 9;

const AdminSolutions = () => {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [page, setPage] = useState(1);

  const navigate = useNavigate()

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const res = await getAllSolutions();
      console.log(res.data.solutions)
      const data = res?.data?.solutions || [];
      setSolutions(data);
      setPage(1); // reset page on refetch
    } catch (err) {
      console.error("Failed to fetch solutions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions(page, 10);
  }, []);

  const handleToggleVisibility = async (solutionId) => {
    try {
      setUpdatingId(solutionId);
      await toggleSolutionVisibility(solutionId);
      await fetchSolutions();
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
  const totalPages = Math.ceil(solutions.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentSolutions = solutions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* HEADER */}
      <div className="p-1 flex flex-col gap-2">
        <h1 className="text-2xl font-bold">ALL SOLUTIONS</h1>
        <p className="text-stone-600">
          Admin control panel for platform solutions.
        </p>
      </div>

      {/* GRID CONTAINER */}
      <div className="bg-white rounded-xl w-full py-4 px-4 flex flex-col gap-6 border-2 border-gray-300">

        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold">Solutions</h2>
          <span className="h-5 w-5 bg-black text-white rounded-full flex items-center justify-center text-xs">
            {solutions.length}
          </span>
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentSolutions.map((solution) => (
            <div
              key={solution._id}
              className="rounded-xl border border-gray-400 p-4 bg-white hover:border-gray-300 transition"
            >
              {/* HEADER */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    {solution.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Answeredby{" "}
                    <span className="font-medium text-gray-700">
                      : {solution.answeredBy?.fullName || "Unknown User"}
                    </span>
                  </p>
                </div>

                {/* ENTITY TYPE / STATUS */}
                <span className="text-[11px] px-2 py-[2px] rounded-md border border-gray-200 text-gray-600 whitespace-nowrap">
                  Solution
                </span>
              </div>

              {/* DIVIDER */}
              <div className="my-3 h-[1px] bg-gray-100 rounded" />

              {/* META ROW */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  {new Date(solution.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                <span className="italic">
                  Entity ID: {solution._id}
                </span>
              </div>

              {/* TAGS */}
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">


                <span
                  className={`border rounded px-2 py-[2px]
                    ${solution.isDeleted
                      ? "border-red-300 text-red-600"
                      : "border-green-300 text-green-600"}
                    `}
                >
                  {solution.isDeleted ? "Hidden" : "Visible"}
                </span>
              </div>

              {/* ACTION */}
              <div className="flex gap-3">
                <button
                  disabled={updatingId === solution._id}
                  onClick={() => handleToggleVisibility(solution._id)}
                  className={`mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition
                 ${solution.isDeleted
                      ? "border-green-400 text-green-700 hover:bg-green-50"
                      : "border-red-400 text-red-700 hover:bg-red-50"}
                ${updatingId === solution._id && "opacity-50 cursor-not-allowed"}
                `}
                >
                  {solution.isDeleted ? <FaEye /> : <FaEyeSlash />}
                  {solution.isDeleted ? "Restore" : "Hide"}
                </button>

                <button onClick={() => navigate(`/problems/${solution.problemId}`)}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition">View Solution</button>
              </div>
            </div>
          ))}
        </div>


        {/* EMPTY STATE */}
        {solutions.length === 0 && (
          <p className="text-center text-sm text-gray-500 py-6">
            No solutions found.
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

export default AdminSolutions;
