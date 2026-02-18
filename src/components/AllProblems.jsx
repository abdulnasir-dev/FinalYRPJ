import React, { useEffect, useState } from "react";
import { fetchAllProblems } from "../api/problems.api";
import { useNavigate, useOutletContext } from "react-router-dom";
import { LoaderOne } from "./ui/loader";
import ViewButton from "./ui/ViewButton";
import StarButton from "./ui/StarButton";

const AllProblems = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const navigate = useNavigate();
    const { selectedCategory, setSelectedCategory } = useOutletContext();

    const LIMIT = 10;

    useEffect(() => {
        const fetchProblems = async () => {
            try {
                setLoading(true);
                const res = await fetchAllProblems(page, LIMIT);
                setProblems(res.data.problems || []);
                const calculatedTotalPages =
                    Math.ceil(res.data.total / res.data.limit) || 1;
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

    const filteredProblems =
        selectedCategory === "all"
            ? problems
            : problems.filter(
                (p) =>
                    p.category?.toLowerCase() ===
                    selectedCategory.toLowerCase()
            );

    return (
        <div className="flex flex-col h-full p-4 gap-6 bg-gradient-to-br from-gray-50 to-gray-100">

            <div className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm px-4 py-3 md:px-5 md:py-4">

                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-24 h-12 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-3">

                    {/* Left Side */}
                    <div className="space-y-1">
                        <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900">
                            Community{" "}
                            <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                                Problems
                            </span>
                        </h1>

                        <div className="flex items-center gap-3 text-xs md:text-sm text-gray-600">
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-green-500 rounded-full" />
                                <span>{filteredProblems.length} visible</span>
                            </div>

                            {selectedCategory !== "all" && (
                                <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs font-medium capitalize">
                                    {selectedCategory}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Right Side CTA */}
                    <div className="flex items-center w-full md:w-auto justify-end">
                        <StarButton
                            onClick={() => navigate("/dashboard/create")}
                            starcolor="rgb(79,70,229)"
                        />
                    </div>

                </div>
            </div>




            {/* Main Container */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">


                {/* Top Bar */}
                <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b bg-white/60 backdrop-blur">

                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Problems
                        </h2>

                        {selectedCategory !== "all" && (
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className="text-sm text-blue-600 hover:text-blue-800 transition"
                            >
                                Clear filter
                            </button>
                        )}

                        <div className="px-2 py-0.5 bg-black text-white rounded-full text-xs font-medium">
                            {filteredProblems.length}
                        </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center gap-3">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                                ${page === 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-100 hover:bg-gray-200 hover:scale-105"
                                }`}
                        >
                            Prev
                        </button>

                        <span className="text-sm font-medium text-gray-600">
                            {page} / {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                                ${page === totalPages
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-gray-100 hover:bg-gray-200 hover:scale-105"
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

                    {filteredProblems.map((problem) => (
                        <div
                            key={problem._id}
                            onClick={() => navigate(`/problems/${problem._id}`)}
                            className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 cursor-pointer"
                        >
                            {/* Meta */}
                            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                <div className="flex items-center gap-3">
                                    {problem.createdBy?.coverImage ? (
                                        <img
                                            src={problem.createdBy.coverImage}
                                            alt={problem.createdBy.fullName}
                                            className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-200"
                                        />
                                    ) : (
                                        <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">
                                            {problem.createdBy?.fullName?.[0] || "U"}
                                        </div>
                                    )}
                                    <span className="font-medium text-gray-700">
                                        {problem.createdBy?.fullName ?? "Unknown"}
                                    </span>

                                    {problem.isPinned && (
                                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                            Pinned
                                        </span>
                                    )}
                                </div>

                                <span>
                                    {new Date(problem.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-56 shrink-0">
                                    <div className="h-36 rounded-xl overflow-hidden bg-gray-100">
                                        {problem.bannerImage ? (
                                            <img
                                                src={problem.bannerImage.url}
                                                alt={problem.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                                No Image
                                            </div>
                                        )}
                                    </div>


                                    <div className="mt-3 flex items-center gap-2 p-2">
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${problem.status === "solved"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-orange-100 text-orange-600"
                                                }`}
                                        >
                                            {problem.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col flex-1 gap-3">
                                    <h3 className="text-xl font-semibold text-gray-800 group-hover:text-black transition">
                                        {problem.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {problem.description}
                                    </p>

                                    <span className="text-xs text-gray-400 capitalize mt-2">
                                        {problem.category}
                                    </span>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllProblems;
