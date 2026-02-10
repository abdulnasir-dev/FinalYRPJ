import React, { useEffect, useState } from "react";
// import { FaFilter } from "react-icons/fa6";
import { fetchAllProblems } from "../api/problems.api";
import { useNavigate } from "react-router-dom";
import { LoaderOne } from "./ui/loader";

const AllProblems = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate()


    const LIMIT = 10;

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                setLoading(true);
                const res = await fetchAllProblems(page, LIMIT);
                setProblems(res.data.problems || []);
                // console.log(res.data)
                // Calculate totalPages from total and limit
                const calculatedTotalPages = Math.ceil(res.data.total / res.data.limit) || 1;
                setTotalPages(calculatedTotalPages);
            } catch (error) {
                console.error("Failed to fetch problems", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProblems();
    }, [page]);

    if (loading) {
            return (
                <div className="flex h-full w-full items-center justify-center">
                    <LoaderOne />
                </div>
            );
        }

    return (
        <div className="flex flex-col h-full p-4 gap-4 overflow-hidden">

            {/* Header */}
            <div className="shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="shrink-0">
                    <h1 className="text-xl sm:text-2xl font-bold">ALL PROBLEMS</h1>
                    <p className="text-sm sm:text-base text-stone-600">
                        Browse problems raised by the community.
                    </p>
                </div>
                <div className="w-full sm:w-auto">
                    <button
                        onClick={() => navigate(`/dashboard/create`)}
                        className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-semibold rounded-lg shadow-md transition-colors duration-200"
                    >
                        Post Problem
                    </button>
                </div>
            </div>

            {/* Scrollable container */}
            <div className="flex-1 bg-white rounded-xl border-2 border-gray-300 flex flex-col overflow-hidden">

                {/* Top bar */}
                <div className="px-4 py-3 flex justify-between items-center border-b shrink-0">

                    {/* Title row */}
                    <div className="flex justify-between items-center gap-2 flex-wrap md:flex-nowrap">
                        <div className="flex items-center gap-2 min-w-0">
                            <h2 className="text-base md:text-lg font-bold truncate">
                                Problems
                            </h2>
                            <div className="h-5 w-5 bg-black text-white rounded-full flex justify-center items-center text-xs shrink-0">
                                {problems.length}
                            </div>
                        </div>

                        {/* <FaFilter className="w-5 h-5 cursor-pointer hidden md:block" /> */}
                    </div>

                    {/* Pagination row */}
                    <div className=" flex justify-center md:justify-end items-center gap-2">

                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className={`px-3 py-1 text-sm rounded-md border
                ${page === 1
                                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                    : "hover:bg-gray-100"
                                }`}
                        >
                            Prev
                        </button>

                        <span className="text-sm font-medium whitespace-nowrap">
                            {page} / {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className={`px-3 py-1 text-sm rounded-md border
                ${page === totalPages
                                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                    : "hover:bg-gray-100"
                                }`}
                        >
                            Next
                        </button>

                        {/* <FaFilter className="w-5 h-5 cursor-pointer md:hidden ml-2" /> */}
                    </div>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">

                    {loading ? (
                        <p className="text-sm text-gray-500">Loading...</p>
                    ) : (
                        problems.map((problem) => (
                            <div
                                key={problem._id}
                                onClick={() => navigate(`/problems/${problem._id}`)}
                                className="bg-white rounded-lg w-full p-4 border-2 border-gray-300 flex flex-col gap-3 cursor-pointer"
                            >

                                {/* Meta */}
                                <div className="flex justify-between text-xs md:text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-700">
                                            {problem.createdBy?.fullName ?? "Unknown"}
                                        </span>

                                        {problem.isPinned && (
                                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                                PINNED
                                            </span>
                                        )}
                                    </div>

                                    <span>
                                        {new Date(problem.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>

                                {/* Image + content */}
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="w-full md:w-48 h-32 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                        {problem.bannerImage ? (
                                            <img
                                                src={problem.bannerImage}
                                                alt={problem.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col gap-2">
                                        <h3 className="text-lg font-bold text-gray-800">
                                            {problem.title}
                                        </h3>
                                        <p className="text-sm text-gray-700 line-clamp-3">
                                            {problem.description}
                                        </p>
                                        <p className="text-xs text-gray-500 capitalize">
                                            Category: {problem.category}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="flex justify-between items-center flex-wrap gap-2 text-sm">
                                    <span
                                        className={`font-semibold ${problem.status === "solved"
                                            ? "text-green-600"
                                            : "text-orange-600"
                                            }`}
                                    >
                                        {problem.status.toUpperCase()}
                                    </span>

                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs font-semibold">
                                        View Details
                                    </button>
                                </div>

                            </div>
                        ))
                    )}

                </div>
            </div>
        </div>
    );
};

export default AllProblems;
