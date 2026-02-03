import { approveExpertApplication, approveRedemptionRequest, getExpertApplicationRequests, getRedemptionRequests, rejectExpertApplication, rejectRedemptionRequest } from "@/api/admin.users";
import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { LoaderOne } from "../ui/loader";


const Requests = () => {
    const [loading, setLoading] = useState(true);
    const [expertRequests, setExpertRequests] = useState([]);
    const [redemptionRequests, setRedemptionRequests] = useState([]);

    const fetchRequests = async () => {
        try {
            setLoading(true);

            const [expertRes, redemptionRes] = await Promise.all([
                getExpertApplicationRequests(),
                getRedemptionRequests(),
            ]);

            setExpertRequests(expertRes.data.requests || []);
            setRedemptionRequests(redemptionRes.data.requests || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleApproveExpert = async (id) => {
        await approveExpertApplication(id);
        fetchRequests();
    };

    const handleRejectExpert = async (id) => {
        await rejectExpertApplication(id);
        fetchRequests();
    };

    const handleApproveRedemption = async (id) => {
        await approveRedemptionRequest(id);
        fetchRequests();
    };

    const handleRejectRedemption = async (id) => {
        await rejectRedemptionRequest(id);
        fetchRequests();
    };

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <LoaderOne />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 h-full">

            {/* HEADER */}
            <div className="p-1 flex flex-col gap-2">
                <h1 className="text-2xl font-bold">REQUESTS</h1>
                <p className="text-stone-600">
                    Review and process pending user requests.
                </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-black text-white rounded-xl px-6 py-4">
                    <p className="text-sm opacity-70">Total Requests</p>
                    <p className="text-2xl font-bold">
                        {expertRequests.length + redemptionRequests.length}
                    </p>
                </div>

                <div className="bg-purple-600 text-white rounded-xl px-6 py-4">
                    <p className="text-sm opacity-70">Expert Applications</p>
                    <p className="text-2xl font-bold">{expertRequests.length}</p>
                </div>

                <div className="bg-green-600 text-white rounded-xl px-6 py-4">
                    <p className="text-sm opacity-70">Redemption Requests</p>
                    <p className="text-2xl font-bold">{redemptionRequests.length}</p>
                </div>
            </div>

            {/* LIST */}
            <div className="bg-white rounded-xl w-full py-3 px-4 flex flex-col gap-4 border-2 border-gray-300">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold">Pending Requests</h2>
                    <FaFilter size={20} />
                </div>

                {/* EXPERT APPLICATIONS */}
                {expertRequests.map((req) => (
                    <div key={req._id} className="border-2 border-gray-300 rounded-md p-4 flex flex-col gap-3">
                        <div>
                            <h3 className="font-semibold">Expert Application</h3>
                            <p className="text-sm text-gray-500">
                                {req.userId.fullName} • Joined{" "}
                                {new Date(req.userId.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="text-sm text-gray-700">
                            <p><strong>Experience:</strong> {req.experience} years</p>
                            <p><strong>Categories:</strong> {req.expertCategories.join(", ")}</p>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => handleApproveExpert(req._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleRejectExpert(req._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}

                {/* REDEMPTION REQUESTS */}
                {/* REDEMPTION REQUESTS */}
                {redemptionRequests.map((req) => (
                    <div key={req._id} className="border-2 border-gray-300 rounded-md p-4 flex flex-col gap-3">
                        <div>
                            <h3 className="font-semibold">Redemption Request</h3>
                            <p className="text-sm text-gray-500">
                                {req.userId?.fullName || "Unknown User"} • {" "}
                                {req.userId?.email || "No email"}
                            </p>
                        </div>

                        <div className="text-sm text-gray-700">
                            <p><strong>Points:</strong> {req.points}</p>
                            <p><strong>Reward Type:</strong> {req.rewardType || "N/A"}</p>
                            <p><strong>Requested:</strong> {new Date(req.createdAt).toLocaleDateString()}</p>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => handleApproveRedemption(req._id)}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => handleRejectRedemption(req._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}

                {expertRequests.length === 0 && redemptionRequests.length === 0 && (
                    <p className="text-center text-gray-500 py-6">
                        No pending requests.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Requests;
