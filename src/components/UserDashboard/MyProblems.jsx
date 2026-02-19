import React, { useEffect, useState } from "react";
import { myProblems } from "../../api/userDashboard";
import { FaFilter } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { LoaderOne } from "../ui/loader";
import Button from "../ui/Button";
import DeleteButton from "../ui/DeleteButton";

const MyProblems = () => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProblems = async () => {
      try {
        setLoading(true);
        const res = await myProblems();
        setProblems(res.data.problems);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProblems();
  }, []);

  const handleDelete = async (problemId) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      console.log("Delete problem:", problemId);
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
    <div className="flex flex-col gap-8 h-full bg-gradient-to-br from-slate-50 to-white p-4">

      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm px-6 py-6">
        <h1 className="text-3xl font-bold bg-gradient-to-br from-emerald-900 to-teal-400 bg-clip-text text-transparent">
          My Problems
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Manage and track the problems you've shared with the community.
        </p>
      </div>

      {/* MAIN CONTAINER */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200 p-6 flex flex-col gap-6">

        {/* TOP BAR */}
        <div className="flex justify-between items-center">

          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-800">
              Manage Problems
            </h2>

            <span className="px-3 py-1 text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow">
              {problems.length}
            </span>
          </div>

          <button className="p-2 rounded-lg hover:bg-slate-100 transition">
            <FaFilter size={18} className="text-slate-600" />
          </button>

        </div>

        {/* PROBLEM LIST */}
        <div className="flex flex-col gap-4">

          {problems.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              You haven’t posted any problems yet.
            </div>
          )}

          {problems.map((problem) => (
            <div
              key={problem._id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* LEFT */}
              <div className="flex flex-col gap-2 flex-1">

                <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                  {problem.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">

                  <span>
                    {new Date(problem.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      problem.status === "open"
                        ? "bg-amber-100 text-amber-700"
                        : problem.status === "solved"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {problem.status.charAt(0).toUpperCase() +
                      problem.status.slice(1)}
                  </span>

                </div>
              </div>

              {/* RIGHT ACTIONS */}
              <div className="flex items-center gap-4 flex-wrap">

                <button
                  onClick={() =>
                    navigate(`/problems/${problem._id}`)
                  }
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm font-semibold shadow hover:opacity-90 transition"
                >
                  View Solutions
                </button>

                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      navigate(`/problems/${problem._id}/edit`)
                    }
                  />
                  <DeleteButton
                    onClick={() =>
                      handleDelete(problem._id)
                    }
                  />
                </div>

              </div>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default MyProblems;
