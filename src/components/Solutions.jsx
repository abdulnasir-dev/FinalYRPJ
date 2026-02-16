import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    createSolution,
    fetchSolutionsForProblem,
    acceptSolution,
    reportSolution
} from "../api/solution.api";
import { useNavigate } from "react-router-dom";

const Solutions = ({
    problemId,
    problemOwnerId,
    currentUserId,
    problemStatus,
    currentUserRole
}) => {
    const navigate = useNavigate();
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
                setSolutions(res.data.solutions || []);
            } catch (err) {
                console.error("Failed to fetch solutions", err);
            } finally {
                setLoading(false);
            }
        };

        if (problemId) getSolutions();
    }, [problemId]);

    const handleReportSolution = async (solutionId) => {
        try {
            await toast.promise(
                reportSolution(solutionId),
                {
                    loading: "Reporting solution...",
                    success: "Solution reported",
                    error: "Failed to report solution",
                }
            );

            // update UI
            setSolutions((prev) =>
                prev.map((sol) =>
                    sol._id === solutionId
                        ? { ...sol, isReported: true }
                        : sol
                )
            );
        } catch (err) {
            console.error("Report failed", err);
        }
    };

    const handleSubmit = async () => {
        const trimmed = answer.trim();
        if (!trimmed) return toast.error("Please enter a solution");
        if (trimmed.length < 20)
            return toast.error("Solution must be at least 20 characters long");
        if (trimmed.length > 2000)
            return toast.error("Solution must not exceed 2000 characters");

        try {
            setSubmitting(true);

            const res = await toast.promise(
                createSolution(problemId, trimmed),
                {
                    loading: "Posting solution...",
                    success: "Solution posted successfully! 🎉",
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
                    toast.error(message || "Not allowed");
                }
            } else if (err.response?.status === 409) {
                toast.error("You already submitted a solution");
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

            setSolutions((prev) =>
                prev.map((sol) =>
                    sol._id === solutionId
                        ? { ...sol, isAccepted: true }
                        : sol
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

    const isProblemOwner = currentUserId === problemOwnerId;
    const isProblemOpen = problemStatus === "open";
    const isAdmin = currentUserRole === "admin";

    return (
        <div className="mt-10 flex flex-col gap-6">
            {/* Add Solution Box */}
            <div className="bg-white rounded-xl border-2 border-gray-300 p-4">
                <h3 className="text-sm font-semibold mb-2">Add a solution</h3>

                <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Share your solution…"
                    className="w-full min-h-[100px] resize-none border border-gray-300 rounded-lg p-3 text-sm"
                />

                <div className="flex justify-between items-center mt-2">
                    <span
                        className={`text-xs ${charCount > 0 && !isValid
                                ? "text-red-500"
                                : "text-gray-500"
                            }`}
                    >
                        {charCount}/2000 characters
                    </span>
                </div>

                <div className="flex justify-end mt-3">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !answer.trim() || isBanned}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold text-white
                            ${submitting || !answer.trim()
                                ? "bg-gray-400"
                                : "bg-blue-500 hover:bg-blue-600"
                            }`}
                    >
                        {submitting ? "Posting..." : "Post Solution"}
                    </button>
                </div>
            </div>

            {/* Solutions */}
            <h2 className="text-lg font-bold">
                Solutions ({solutions.length})
            </h2>

            <div className="flex flex-col gap-6">
                {solutions.map((solution) => {
                    const isOwnSolution =
                        solution.answeredBy?._id === currentUserId;

                    const canAccept =
                        isProblemOwner &&
                        !isOwnSolution &&
                        !solution.isAccepted &&
                        isProblemOpen;

                    const canReport =
                        (isProblemOwner || isAdmin) &&
                        !isOwnSolution &&
                        !solution.isReported;

                    return (
                        <div
                            key={solution._id}
                            className="bg-white rounded-xl border-2 border-gray-300 p-4"
                        >
                            {/* Header */}
                            <div className="flex justify-between w-full">
                                <div className="flex items-center gap-3">
                                    <div
                                        onClick={() =>
                                            navigate(
                                                `/dashboard/profile/${solution.answeredBy._id}`
                                            )
                                        }
                                        className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700 cursor-pointer"
                                    >
                                        {solution.answeredBy?.fullName?.charAt(
                                            0
                                        ) || "U"}
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-800">
                                                {solution.answeredBy?.fullName}
                                            </span>

                                            {solution.isAccepted && (
                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-semibold">
                                                    ✓ ACCEPTED
                                                </span>
                                            )}

                                            {solution.isReported && (
                                                <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-semibold">
                                                    ⚠ REPORTED
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            {new Date(
                                                solution.createdAt
                                            ).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {canReport && (
                                        <button
                                            onClick={() =>
                                                handleReportSolution(
                                                    solution._id
                                                )
                                            }
                                            className="text-xs font-semibold text-red-500 hover:text-red-600"
                                        >
                                            Report
                                        </button>
                                    )}

                                    {canAccept && (
                                        <button
                                            onClick={() =>
                                                handleAcceptSolution(
                                                    solution._id
                                                )
                                            }
                                            disabled={
                                                acceptingId === solution._id
                                            }
                                            className="px-3 py-1.5 bg-green-500 text-white text-xs rounded-lg"
                                        >
                                            {acceptingId === solution._id
                                                ? "Accepting..."
                                                : "Accept"}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Body */}
                            <p className="mt-3 text-gray-800 whitespace-pre-line">
                                {solution.answer}
                            </p>

                            {/* Footer */}
                            <div className="mt-4 flex gap-4 text-sm text-gray-600">
                                <span>👍 {solution.votes?.upvotes ?? 0}</span>
                                <span>👎 {solution.votes?.downvotes ?? 0}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Solutions;
