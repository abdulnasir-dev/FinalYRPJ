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
            <div className="relative w-full h-[200px] md:h-[240px] lg:h-[300px] overflow-hidden">
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

                <div className="absolute bottom-0 left-0 w-full px-4 py-4 md:px-8 md:py-6 text-white">
                    <h1 className="text-xl md:text-3xl font-bold leading-tight mb-2 drop-shadow-md">
                        {problem.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
                        <span className="bg-white/20 px-2 py-0.5 rounded-full">
                            {problem.category}
                        </span>

                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${problem.status === "solved"
                                ? "bg-green-500/80"
                                : "bg-orange-500/80"
                                }`}
                        >
                            {problem.status.toUpperCase()}
                        </span>

                        {problem.expertOnly && (
                            <span className="bg-purple-500/80 px-2 py-0.5 rounded-full text-xs">
                                Expert
                            </span>
                        )}

                        {problem.isPinned && (
                            <span className="bg-yellow-500/80 px-2 py-0.5 rounded-full text-xs">
                                Pinned
                            </span>
                        )}
                    </div>

                    <div className="mt-2 text-xs md:text-sm text-gray-200">
                        Posted by{" "}
                        <span className="font-semibold">
                            {problem.createdBy.fullName}
                        </span>
                    </div>
                </div>
            </div>

            <div className="w-full px-4 md:px-6 lg:px-6 xl:px-6 py-4 flex flex-col gap-5">
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

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">
                        Description
                    </h2>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {problem.description}
                    </p>
                </div>

                {problem.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {problem.tags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-4 md:px-6 py-3 border-b bg-gray-50 rounded-t-xl">
                        <h2 className="text-sm md:text-base font-semibold text-gray-800">
                            Solutions
                        </h2>
                    </div>

                    <div className="px-4 md:px-6 py-4">
                        <Solutions
                            problemId={problem._id}
                            problemOwnerId={
                                problem.createdBy?._id ||
                                problem.createdBy
                            }
                            currentUserId={currentUserId}
                            problemStatus={problem.status}
                            currentUserRole={user?.role}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Problem;
