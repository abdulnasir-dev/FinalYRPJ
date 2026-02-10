import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createSolution, fetchSolutionsForProblem, acceptSolution } from "../api/solution.api";
import { useNavigate } from "react-router-dom";

const Solutions = ({ problemId, problemOwnerId, currentUserId, problemStatus }) => {
    const navigate = useNavigate()
    const [solutions, setSolutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [acceptingId, setAcceptingId] = useState(null);
    const [isBanned, setIsBanned] = useState(false);

    useEffect(() => {
        const getSolutions = async () => {
            try {
                const res = await fetchSolutionsForProblem(problemId);
                // console.log(res.data)
                setSolutions(res.data.solutions || []);
            } catch (err) {
                console.error("Failed to fetch solutions", err);
            } finally {
                setLoading(false);
            }
        };

        if (problemId) getSolutions();
    }, [problemId]);

    const handleSubmit = async () => {
        const trimmed = answer.trim();
        if (!trimmed) {
            toast.error("Please enter a solution");
            return;
        }

        if (trimmed.length < 20) {
            toast.error("Solution must be at least 20 characters long");
            return;
        }

        if (trimmed.length > 2000) {
            toast.error("Solution must not exceed 2000 characters");
            return;
        }

        try {
            setSubmitting(true);

            const res = await toast.promise(
                createSolution(problemId, trimmed),
                {
                    loading: "Posting solution...",
                    success: "Solution posted successfully! 🎉",
                    // error: "Failed to post solution",
                }
            );

            setSolutions((prev) => [res.data.solution, ...prev]);
            setAnswer("");
        } catch (err) {
            console.error("Failed to add solution", err);

            if (err.response?.status === 403) {
                const message = err.response?.data?.message || "";

                if (message.toLowerCase().includes("ban")) {
                    setIsBanned(true);
                    toast.error("You are banned. Try again later.");
                } else {
                    toast.error(message || "Not allowed to perform this action");
                }
            } else if (err.response?.status === 409) {
                toast.error("You have already submitted a solution for this problem");
            } else {
                toast.error("Failed to post solution");
            }

        } finally {
            setSubmitting(false);
        }
    };

    const handleAcceptSolution = async (solutionId) => {
        try {
            setAcceptingId(solutionId);

            await toast.promise(
                acceptSolution(solutionId),
                {
                    loading: "Accepting solution...",
                    success: "Solution accepted! ✅",
                    error: "Failed to accept solution",
                }
            );

            // Update the solution to show it's accepted
            setSolutions((prev) =>
                prev.map((sol) =>
                    sol._id === solutionId ? { ...sol, isAccepted: true } : sol
                )
            );
        } catch (err) {
            console.error("Failed to accept solution", err);
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            }
        } finally {
            setAcceptingId(null);
        }
    };

    const charCount = answer.trim().length;
    const isValid = charCount >= 20 && charCount <= 2000;

    // Check if current user is the problem owner
    const isProblemOwner = currentUserId === problemOwnerId;
    const isProblemOpen = problemStatus === "open";

    return (
        <div className="mt-10 flex flex-col gap-6">
            {/* ===== Add Solution Box ===== */}
            <div className="bg-white rounded-xl border-2 border-gray-300 p-4">
                <h3 className="text-sm font-semibold mb-2">Add a solution</h3>

                <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Share your solution or suggestion…"
                    className="w-full min-h-[100px] resize-none border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />

                <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs ${charCount > 0 && !isValid ? 'text-red-500' : 'text-gray-500'}`}>
                        {charCount}/2000 characters {charCount > 0 && charCount < 20 && `(minimum 20)`}
                    </span>
                </div>

                <div className="flex justify-end mt-3">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !answer.trim() || isBanned}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold text-white
                            ${submitting || !answer.trim()
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600"
                            }`}
                    >
                        {submitting ? "Posting..." : "Post Solution"}
                    </button>
                </div>
            </div>

            {/* ===== Solutions Header ===== */}
            <h2 className="text-lg font-bold">
                Solutions ({solutions.length})
            </h2>

            {loading && (
                <p className="text-sm text-gray-500">Loading solutions...</p>
            )}

            {!loading && solutions.length === 0 && (
                <p className="text-sm text-gray-500">
                    No solutions yet. Be the first to help!
                </p>
            )}

            {/* ===== Solutions List ===== */}
            <div className="flex flex-col gap-6">
                {solutions.map((solution) => {
                    const isOwnSolution = solution.answeredBy?._id === currentUserId;
                    const canAccept = isProblemOwner && !isOwnSolution && !solution.isAccepted && isProblemOpen;

                    return (
                        <div
                            key={solution._id}
                            className="bg-white rounded-xl border-2 border-gray-300 p-4"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        onClick={() =>
                                            navigate(`/dashboard/profile/${solution.answeredBy._id}`)
                                        }
                                        className="w-10 h-10 rounded-full overflow-hidden bg-green-100 flex items-center justify-center font-bold text-green-700 cursor-pointer"
                                    >
                                        {solution.answeredBy?.coverImage ? (
                                            <img
                                                src={solution.answeredBy.coverImage}
                                                alt={solution.answeredBy.fullName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            solution.answeredBy?.fullName?.charAt(0) || "U"
                                        )}
                                    </div>


                                    <div>
                                        <div
                                            onClick={() =>
                                                navigate(`/dashboard/profile/${solution.answeredBy._id}`)
                                            }
                                            className="flex items-center gap-2 cursor-pointer">
                                            <span className="font-semibold text-gray-800">
                                                {solution.answeredBy?.fullName ?? "Unknown"}
                                            </span>

                                            {solution.isAccepted && (
                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                                                    ✓ ACCEPTED
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            {new Date(solution.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Accept Button - Only show for problem owner */}
                                {canAccept && (
                                    <button
                                        onClick={() => handleAcceptSolution(solution._id)}
                                        disabled={acceptingId === solution._id}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                                            ${acceptingId === solution._id
                                                ? "bg-gray-400 text-white cursor-not-allowed"
                                                : "bg-green-500 text-white hover:bg-green-600"
                                            }`}
                                    >
                                        {acceptingId === solution._id ? "Accepting..." : "Accept Solution"}
                                    </button>
                                )}
                            </div>

                            {/* Body */}
                            <p className="mt-3 text-gray-800 whitespace-pre-line">
                                {solution.answer}
                            </p>

                            {/* Footer */}
                            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                                <span>👍 {solution.votes?.upvotes ?? 0}</span>
                                <span>👎 {solution.votes?.downvotes ?? 0}</span>
                                {solution.isEdited && (
                                    <span className="text-xs italic text-gray-400">
                                        Edited
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Solutions;