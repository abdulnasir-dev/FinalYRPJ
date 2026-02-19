import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { FetchMySolutions } from "../../api/userDashboard";
import { useNavigate } from "react-router-dom";
import { LoaderOne } from "../ui/loader";
import DeleteButton from "../ui/DeleteButton";

const MySolutions = () => {
  const [solutions, setSolutions] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMySolutions = async () => {
      try {
        setLoading(true);
        const res = await FetchMySolutions();
        setSolutions(res.data.solutions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMySolutions();
  }, []);

  const handleDelete = async (solutionId) => {
    if (window.confirm("Are you sure you want to delete this solution?")) {
      console.log("Delete solution:", solutionId);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LoaderOne />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 h-full bg-gradient-to-br from-slate-50 to-white p-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-7">
        <h1 className="text-3xl font-semibold tracking-tight  bg-gradient-to-br from-emerald-900 to-teal-400 bg-clip-text text-transparent">
          My Solutions
        </h1>
        <p className="text-slate-500 text-[15px] mt-3">
          Review and manage your contributions to community problems.
        </p>
      </div>

      {/* MAIN CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 flex flex-col gap-8">

        {/* TOP BAR */}
        <div className="flex justify-between items-center">

          <div className="flex items-center gap-4">
            <h2 className="text-lg font-medium text-slate-800 tracking-tight">
              My Contributions
            </h2>

            <span className="px-3 py-1 text-xs font-semibold bg-slate-900 text-white rounded-full">
              {solutions.length}
            </span>
          </div>

          <button className="p-2 rounded-lg hover:bg-slate-100 transition">
            <FaFilter size={18} className="text-slate-500" />
          </button>

        </div>

        {/* SOLUTION LIST */}
        <div className="flex flex-col gap-6">

          {solutions.length === 0 && (
            <div className="text-center py-16 text-slate-400 text-sm">
              You haven’t submitted any solutions yet.
            </div>
          )}

          {solutions.map((solution) => (
            <div
              key={solution._id}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-5 hover:shadow-lg transition-all duration-200"
            >

              {/* PROBLEM TITLE */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wide text-slate-800 mb-1">
                    Problem
                  </p>

                  <h2 className="text-lg font-semibold text-slate-900 leading-snug">
                    {solution.problemId?.title ||
                      "Problem title unavailable"}
                  </h2>
                </div>

                <div className="text-sm text-slate-500 whitespace-nowrap">
                  {new Date(solution.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                </div>

              </div>

              {/* SOLUTION TEXT */}
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                  Your Solution
                </p>

                <p className="text-slate-700 text-sm leading-relaxed line-clamp-3">
                  {solution.answer}
                </p>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-between items-center flex-wrap gap-4 pt-2">

                <button
                  onClick={() =>
                    navigate(
                      `/problems/${solution.problemId._id || solution.problemId}`
                    )
                  }
                  className="px-5 py-2 text-sm font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition"
                >
                  View Problem
                </button>

                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(solution._id);
                  }}
                />

              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default MySolutions;

