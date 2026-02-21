import {
    approveRedemptionRequest,
    getRedemptionRequests,
    rejectRedemptionRequest,
} from "@/api/admin.users";
import React, { useEffect, useState } from "react";
import { FaFilter, FaCheck, FaXmark, FaArrowUpRightFromSquare, FaInbox } from "react-icons/fa6";
import { LoaderOne } from "../ui/loader";
import { fetchAllExpertApplications, reviewExpertApplication } from "@/api/expert.api";
import { toast } from "react-hot-toast"; // Ensure this is imported

const Requests = () => {
    const [loading, setLoading] = useState(true);
    const [expertRequests, setExpertRequests] = useState([]);
    const [redemptionRequests, setRedemptionRequests] = useState([]);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const [expertRes, redemptionRes] = await Promise.all([
                fetchAllExpertApplications(),
                getRedemptionRequests(),
            ]);
            setExpertRequests(expertRes.data.applications || []);
            setRedemptionRequests(redemptionRes.data.requests || []);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // TOAST INTEGRATED: Expert Review
    const handleReviewExpert = async (id, action) => {
        try {
            await toast.promise(
                reviewExpertApplication(id, action),
                {
                    loading: `Processing ${action}...`,
                    success: () => {
                        fetchRequests();
                        return `Expert application ${action} successfully!`;
                    },
                    error: (err) => err.response?.data?.message || `Failed to ${action} application`,
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    // TOAST INTEGRATED: Redemption Approval
    const handleApproveRedemption = async (id) => {
        try {
            await toast.promise(
                approveRedemptionRequest(id),
                {
                    loading: "Fulfilling request...",
                    success: () => {
                        fetchRequests();
                        return "Redemption fulfilled! 🎁";
                    },
                    error: "Failed to fulfill request",
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    // TOAST INTEGRATED: Redemption Rejection
    const handleRejectRedemption = async (id) => {
        try {
            await toast.promise(
                rejectRedemptionRequest(id),
                {
                    loading: "Cancelling request...",
                    success: () => {
                        fetchRequests();
                        return "Redemption cancelled.";
                    },
                    error: "Failed to cancel request",
                }
            );
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return (
        <div className="flex h-full w-full items-center justify-center min-h-[400px]">
            <LoaderOne />
        </div>
    );

    return (
        <div className="flex flex-col gap-6 h-full p-2 max-w-[1400px] mx-auto">

            {/* HEADER SECTION */}
            <div className="p-1 flex flex-col gap-1">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">PENDING REQUESTS</h1>
                <p className="text-slate-500 text-sm font-medium">Review expert verifications and reward fulfillment.</p>
            </div>

            {/* STATS TILES */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 text-white rounded-2xl px-6 py-5 shadow-lg border border-slate-800">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Total Queue</p>
                    <p className="text-3xl font-black mt-1">{expertRequests.length + redemptionRequests.length}</p>
                </div>

                <div className="bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Expert Apps</p>
                    <p className="text-3xl font-black mt-1 text-emerald-600">{expertRequests.length}</p>
                </div>

                <div className="bg-white border-2 border-slate-200 rounded-2xl px-6 py-5 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Redemptions</p>
                    <p className="text-3xl font-black mt-1 text-blue-600">{redemptionRequests.length}</p>
                </div>
            </div>

            {/* MAIN ACTIVITY LIST */}
            <div className="bg-white rounded-[2rem] border-2 border-slate-200 shadow-xl overflow-hidden mb-10">
                <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                        <h2 className="font-black text-slate-800 tracking-tight uppercase text-sm">Action Required</h2>
                        <div className="h-6 w-6 bg-slate-900 text-white rounded-full flex justify-center items-center text-[10px] font-bold">
                            {expertRequests.length + redemptionRequests.length}
                        </div>
                    </div>
                    <FaFilter size={18} className="text-slate-400 cursor-pointer hover:text-slate-900 transition-colors" />
                </div>

                <div className="flex flex-col divide-y-2 divide-slate-100">
                    {/* EXPERT APPLICATIONS */}
                    {expertRequests.map((req) => (
                        <div key={req._id} className="p-6 hover:bg-slate-50 transition-all group">
                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-black text-lg border border-emerald-200">
                                            {req.userId?.fullName?.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 tracking-tight uppercase text-base leading-none">
                                                {req.userId?.fullName}
                                            </h3>
                                            <p className="text-xs text-slate-400 font-bold mt-1 tracking-tight">
                                                {req.userId?.email} • Applied {new Date(req.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className="ml-auto lg:ml-0 px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-lg border border-emerald-100">
                                            Expert Verify
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Expertise</span>
                                            <span className="text-xs font-bold text-slate-700 capitalize italic">"{req.expertCategories.join(", ")}"</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Exp Level</span>
                                            <span className="text-xs font-bold text-slate-700">{req.experience} Years</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Evidence</span>
                                            <a href={req.portfolioLink} target="_blank" rel="noreferrer" className="text-xs font-black text-emerald-600 flex items-center gap-1 hover:underline">
                                                PORTFOLIO <FaArrowUpRightFromSquare size={10} />
                                            </a>
                                        </div>
                                    </div>

                                    <div className="text-xs text-slate-500 font-medium bg-slate-100/50 p-3 rounded-xl border border-dashed border-slate-200 line-clamp-2">
                                        "{req.bio}"
                                    </div>
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex lg:flex-col justify-end gap-3 lg:min-w-[140px]">
                                    <button
                                        onClick={() => handleReviewExpert(req._id, "approved")}
                                        className="flex-1 lg:flex-none py-4 px-6 bg-slate-900 text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <FaCheck size={14} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleReviewExpert(req._id, "rejected")}
                                        className="flex-1 lg:flex-none py-4 px-6 bg-white border-2 border-slate-100 text-slate-400 font-black text-[11px] uppercase tracking-widest rounded-xl hover:text-rose-600 hover:border-rose-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <FaXmark size={14} /> Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* REDEMPTION REQUESTS */}
                    {redemptionRequests.map((req) => (
                        <div key={req._id} className="p-6 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-4 group">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex items-center justify-center font-black">
                                    R
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">{req.userId?.fullName || "User"}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        Points: <span className="text-blue-600">{req.points}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <button onClick={() => handleApproveRedemption(req._id)} className="flex-1 md:flex-none px-6 py-2 bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest rounded-lg shadow-sm hover:bg-blue-700 transition-colors">Fulfill</button>
                                <button onClick={() => handleRejectRedemption(req._id)} className="flex-1 md:flex-none px-6 py-2 bg-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-all">Cancel</button>
                            </div>
                        </div>
                    ))}

                    {expertRequests.length === 0 && redemptionRequests.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-300">
                            <FaInbox size={48} className="opacity-20 mb-4" />
                            <h3 className="font-black text-3xl tracking-tighter opacity-20 uppercase">No Pending Tasks</h3>
                            <p className="text-sm font-bold text-slate-400 mt-1">Your queue is completely clear.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Requests;