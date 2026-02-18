import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProblemById } from "../api/problems.api";
import Solutions from "./Solutions";
import { LoaderOne } from "./ui/loader";
import Button from "./ui/Button";
import { getCurrentUserData } from "@/lib/currentUser";

const Problem = () => {
    const { problemId } = useParams();
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = getCurrentUserData();

    const getCurrentUser = () => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload;
        }
        return null;
    };

    const currentUser = getCurrentUser();
    const currentUserId =
        currentUser?._id || currentUser?.userId || currentUser?.id;
    const currentUserRole = currentUser?.role;

    useEffect(() => {
        const getProblem = async () => {
            try {
                setLoading(true);
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
            <div className="flex h-full w-full items-center justify-center">
                <LoaderOne />
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="p-6 text-red-500 font-medium">
                Problem not found
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-gray-50">

            {/* HERO SECTION */}
            <div className="relative w-full h-[320px] md:h-[420px] overflow-hidden">

                {problem.bannerImage ? (
                    <>
                        <img
                            src={problem.bannerImage.url}
                            alt={problem.title}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
                )}

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 drop-shadow-md">
                        {problem.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                            {problem.category}
                        </span>

                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                problem.status === "solved"
                                    ? "bg-green-500/80"
                                    : "bg-orange-500/80"
                            }`}
                        >
                            {problem.status.toUpperCase()}
                        </span>

                        {problem.expertOnly && (
                            <span className="bg-purple-500/80 px-3 py-1 rounded-full text-xs">
                                Expert Only
                            </span>
                        )}

                        {problem.isPinned && (
                            <span className="bg-yellow-500/80 px-3 py-1 rounded-full text-xs">
                                Pinned
                            </span>
                        )}
                    </div>

                    <div className="mt-4 text-sm text-gray-200">
                        Posted by{" "}
                        <span className="font-semibold">
                            {problem.createdBy.fullName}
                        </span>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 flex flex-col gap-8">

                <div className="flex justify-between items-center flex-wrap gap-3 text-sm text-gray-500">
                    <div className="flex items-center gap-6">
                        <span>
                            {new Date(problem.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                }
                            )}
                        </span>
                        <span>👁 {problem.views} views</span>
                    </div>

                    {currentUser &&
                        (problem.createdBy?._id === currentUserId ||
                            currentUserRole === "admin") && (
                            <Button
                                onClick={() =>
                                    navigate(`/problems/${problem._id}/edit`)
                                }
                            />
                        )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                        Description
                    </h2>

                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {problem.description}
                    </p>
                </div>

                {problem.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                        {problem.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 transition rounded-full text-xs font-medium text-gray-700"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
                    <Solutions
                        problemId={problem._id}
                        problemOwnerId={
                            problem.createdBy?._id || problem.createdBy
                        }
                        currentUserId={currentUserId}
                        problemStatus={problem.status}
                        currentUserRole={user?.role}
                    />
                </div>

                <div className="h-16" />
            </div>
        </div>
    );
};

export default Problem;
