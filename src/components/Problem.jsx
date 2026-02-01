import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProblemById } from "../api/problems.api";
import Solutions from "./Solutions";

const Problem = () => {
    const { problemId } = useParams();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);

    const getCurrentUser = () => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload._id || payload.userId || payload.id;
        }
        return null;
    };

    const currentUserId = getCurrentUser();

    useEffect(() => {
        const getProblem = async () => {
            try {
                setLoading(true)
                const res = await fetchProblemById(problemId);
                setProblem(res.data.problem);
            } catch (error) {
                console.error("Failed to fetch problem", error);
            } finally {
                setLoading(false);
            }
        };

        if (problemId) getProblem();
    }, [problemId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-lg font-semibold text-gray-600">Loading Problem...</p>
            </div>
        );
    }

    if (!problem) {
        return <div className="p-4 text-red-500">Problem not found</div>;
    }

    return (
        <div className="h-full overflow-y-auto p-4 flex flex-col gap-5">
            {/* ===== Header ===== */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {problem.title}
                </h1>

                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span className="capitalize">
                        Category: <strong>{problem.category}</strong>
                    </span>
                    <span
                        className={`font-semibold ${problem.status === "solved"
                            ? "text-green-600"
                            : "text-orange-600"
                            }`}
                    >
                        {problem.status.toUpperCase()}
                    </span>
                    {problem.expertOnly && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                            Expert Only
                        </span>
                    )}
                    {problem.isPinned && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                            PINNED
                        </span>
                    )}
                </div>
            </div>

            {/* ===== Banner Image ===== */}
            <div className="w-full min-h-[250px] rounded-xl border bg-gray-100 overflow-hidden flex items-center justify-center">
                {problem.bannerImage ? (
                    <img
                        src={problem.bannerImage}
                        alt={problem.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10 mb-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M3 16l5-5a2 2 0 012.828 0L15 15l2-2a2 2 0 012.828 0L21 15"
                            />
                        </svg>
                        <span className="text-sm">No image provided</span>
                    </div>
                )}
            </div>

            {/* ===== Meta ===== */}
            <div className="flex justify-between flex-wrap gap-2 text-sm text-gray-500">
                <span>
                    Posted on{" "}
                    {new Date(problem.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                    })}
                </span>
                <span>Views: {problem.views}</span>
            </div>

            {/* ===== Description ===== */}
            <div className="bg-white rounded-xl border-2 border-gray-300 p-4">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                    {problem.description}
                </p>
            </div>

            {/* ===== Tags ===== */}
            {problem.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {problem.tags.map((tag, idx) => (
                        <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* ===== SOLUTIONS SECTION ===== */}
            <div className="">
                <Solutions
                    problemId={problem._id}
                    problemOwnerId={problem.createdBy?._id || problem.createdBy}
                    currentUserId={currentUserId}
                    problemStatus={problem.status}
                />
            </div>

            {/* ===== Bottom Padding (important) ===== */}
            <div className="h-20" />
        </div>
    );
};

export default Problem;