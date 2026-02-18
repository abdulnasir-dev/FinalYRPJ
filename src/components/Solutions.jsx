import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createSolution, fetchSolutionsForProblem, acceptSolution, reportSolution } from "../api/solution.api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";

const Solutions = ({ problemId, problemOwnerId, currentUserId, problemStatus, currentUserRole }) => {
    const navigate = useNavigate();
    const [solutions, setSolutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [acceptingId, setAcceptingId] = useState(null);

    useEffect(() => {
        const getSolutions = async () => {
            try {
                const res = await fetchSolutionsForProblem(problemId);
                console.log("Fetched solutions:", res.data.solutions);
                const enriched = (res.data.solutions || []).map(sol => ({
                    ...sol,
                    liked: false,
                    disliked: false,
                    likesCount: sol.likesCount || 0,
                    dislikesCount: sol.dislikesCount || 0,
                }));
                setSolutions(enriched);
            } catch (err) {
                console.error("Failed to fetch solutions", err);
            } finally {
                setLoading(false);
            }
        };

        if (problemId) getSolutions();
    }, [problemId]);

    const reportASolution = async (solutionId) => {
        try {
            await toast.promise(reportSolution(solutionId), {
                loading: "Reporting solution...",
                success: "Solution reported. Thank you for your feedback.",
                error: "Failed to report solution",
            });

            // Update local state so the UI reflects the reported status immediately
            setSolutions((prev) =>
                prev.map((sol) =>
                    sol._id === solutionId ? { ...sol, isReported: true } : sol
                )
            );
        } catch (error) {
            console.error("Error reporting solution", error);
        }
    };

    const toggleLike = (solutionId) => {
        setSolutions(prev =>
            prev.map(sol => {
                if (sol._id !== solutionId) return sol;
                const isLiked = sol.liked;
                const wasDisliked = sol.disliked;

                return {
                    ...sol,
                    liked: !isLiked,
                    disliked: false,
                    likesCount: isLiked ? sol.likesCount - 1 : sol.likesCount + 1,
                    dislikesCount: wasDisliked ? sol.dislikesCount - 1 : sol.dislikesCount,
                };
            })
        );
    };

    const toggleDislike = (solutionId) => {
        setSolutions(prev =>
            prev.map(sol => {
                if (sol._id !== solutionId) return sol;
                const isDisliked = sol.disliked;
                const wasLiked = sol.liked;

                return {
                    ...sol,
                    disliked: !isDisliked,
                    liked: false,
                    dislikesCount: isDisliked ? sol.dislikesCount - 1 : sol.dislikesCount + 1,
                    likesCount: wasLiked ? sol.likesCount - 1 : sol.likesCount,
                };
            })
        );
    };

    const handleSubmit = async () => {
        const trimmed = answer.trim();
        if (!trimmed) return toast.error("Please enter a solution");
        if (trimmed.length < 20)
            return toast.error("Minimum 20 characters required");

        try {
            setSubmitting(true);

            const res = await toast.promise(
                createSolution(problemId, trimmed),
                {
                    loading: "Posting solution...",
                    success: "Solution posted 🎉",
                }
            );

            const newSolution = {
                ...res.data.solution,
                liked: false,
                disliked: false,
                likesCount: res.data.solution.likesCount || 0,
                dislikesCount: res.data.solution.dislikesCount || 0,
            };

            setSolutions(prev => [newSolution, ...prev]);
            setAnswer("");
        } catch (err) {
            toast.error("Failed to post solution");
        } finally {
            setSubmitting(false);
        }
    };

    const handleAcceptSolution = async (solutionId) => {
        try {
            setAcceptingId(solutionId);

            await toast.promise(acceptSolution(solutionId), {
                loading: "Accepting...",
                success: "Solution accepted ✅",
                error: "Failed to accept",
            });

            setSolutions(prev =>
                prev.map(sol =>
                    sol._id === solutionId
                        ? { ...sol, isAccepted: true }
                        : sol
                )
            );
        } finally {
            setAcceptingId(null);
        }
    };

    const isProblemOwner = currentUserId === problemOwnerId;
    const isProblemOpen = problemStatus === "open";
    const isAdmin = currentUserRole === "admin";

    return (
        <div className="flex flex-col gap-10">

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Add a Solution
                </h3>

                <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Share your solution..."
                    className="w-full min-h-[100px] resize-none rounded-xl border border-gray-300 p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />

                <div className="flex justify-end mt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !answer.trim()}
                        className={`px-5 py-2 rounded-xl text-sm font-semibold text-white transition ${submitting || !answer.trim()
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                    >
                        {submitting ? "Posting..." : "Post Solution"}
                    </button>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Solutions ({solutions.length})
                </h2>

                <div className="flex flex-col gap-6">
                    {solutions.map((solution) => {
                        const isOwnSolution =
                            solution.answeredBy?._id === currentUserId;

                        const canAccept = isProblemOwner && !isOwnSolution && !solution.isAccepted && isProblemOpen;
                        const canReport = (isProblemOwner || isAdmin) && !isOwnSolution;

                        return (
                            <div
                                key={solution._id}
                                className={`rounded-2xl border p-6 transition-all duration-300 ${solution.isAccepted
                                    ? "bg-green-50 border-green-200 shadow-md"
                                    : "bg-white border-gray-200 hover:shadow-md"
                                    }`}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            onClick={() =>
                                                navigate(`/dashboard/profile/${solution.answeredBy._id}`)
                                            }
                                            className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center cursor-pointer shadow-sm border border-gray-100"
                                        >
                                            {solution.answeredBy?.coverImage ? (
                                                <img
                                                    src={solution.answeredBy.coverImage}
                                                    alt={solution.answeredBy.fullName}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        // Fallback if image fails to load
                                                        e.target.style.display = 'none';
                                                        e.target.nextSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}

                                            {/* This div acts as the fallback (Initial letter) if coverImage is null or fails */}
                                            <div
                                                style={{ display: solution.answeredBy?.coverImage ? 'none' : 'flex' }}
                                                className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white items-center justify-center font-semibold"
                                            >
                                                {solution.answeredBy?.fullName?.charAt(0) || "U"}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-semibold text-gray-900">
                                                    {solution.answeredBy?.fullName}
                                                </span>

                                                {solution.isAccepted && (
                                                    <span className="px-3 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                                                        ✓ Accepted
                                                    </span>
                                                )}

                                                {solution.isReported && (
                                                    <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                                                        ✓ Reported
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-xs text-gray-500 mt-1">
                                                {new Date(solution.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {canAccept && (
                                            <button
                                                onClick={() => handleAcceptSolution(solution._id)}
                                                disabled={acceptingId === solution._id}
                                                className="px-4 py-1.5 bg-green-600 text-white text-sm rounded-xl hover:bg-green-700 transition"
                                            >
                                                {acceptingId === solution._id
                                                    ? "Accepting..."
                                                    : "Accept"}
                                            </button>
                                        )}

                                        {canReport && !solution.isReported && (
                                            <button
                                                onClick={() =>
                                                    reportASolution(solution._id)
                                                }
                                                className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition"
                                            >
                                                Report
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <p className="mt-5 text-gray-800 leading-relaxed whitespace-pre-line">
                                    {solution.answer}
                                </p>

                                <div className="mt-6 flex items-center gap-8">
                                    <button
                                        onClick={() => toggleLike(solution._id)}
                                        className="flex items-center gap-2 group transition"
                                    >
                                        <motion.div
                                            animate={
                                                solution.liked
                                                    ? { scale: [1, 1.3, 1] }
                                                    : { scale: 1 }
                                            }
                                            transition={{ duration: 0.25 }}
                                        >
                                            <ThumbsUp
                                                size={20}
                                                strokeWidth={2.5}
                                                className={`transition-colors ${solution.liked
                                                    ? "fill-black text-black"
                                                    : "text-gray-600 group-hover:text-black"
                                                    }`}
                                            />
                                        </motion.div>
                                        <span className="text-sm font-semibold text-gray-800">
                                            {solution.likesCount}
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => toggleDislike(solution._id)}
                                        className="flex items-center gap-2 group transition"
                                    >
                                        <motion.div
                                            animate={
                                                solution.disliked
                                                    ? { scale: [1, 1.3, 1] }
                                                    : { scale: 1 }
                                            }
                                            transition={{ duration: 0.25 }}
                                        >
                                            <ThumbsDown
                                                size={20}
                                                strokeWidth={2.5}
                                                className={`transition-colors ${solution.disliked
                                                    ? "fill-black text-black"
                                                    : "text-gray-600 group-hover:text-black"
                                                    }`}
                                            />
                                        </motion.div>
                                        <span className="text-sm font-semibold text-gray-800">
                                            {solution.dislikesCount}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

};

export default Solutions;