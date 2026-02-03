import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { LoaderOne } from "../ui/loader";
// import { getAdminLogs } from "../../api/admin.logs";
import { fetchAdminLogs } from "@/api/admin.users";

/* ------------------ Helpers ------------------ */

const actionLabelMap = {
    approved_redemption_request: "Approved Redemption Request",
    rejected_redemption_request: "Rejected Redemption Request",
    user_banned: "User Banned",
    user_unbanned: "User Unbanned",
    role_changed: "User Role Updated",
};

const getAdminFullName = (log) => {
    if (log.adminId?.fullName) return log.adminId.fullName;
    if (log.adminId?.name) return log.adminId.name;
    if (log.adminName) return log.adminName;
    return "System Administrator";
};

/* ------------------ Component ------------------ */

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const res = await fetchAdminLogs();
                setLogs(res.data.logs || []);
            } catch (error) {
                console.error("Failed to fetch admin logs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

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
                <h1 className="text-2xl font-bold">ADMIN LOGS</h1>
                <p className="text-stone-600">
                    Complete audit trail of administrative actions.
                </p>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-black text-white rounded-xl px-6 py-4">
                    <p className="text-sm opacity-70">Total Logs</p>
                    <p className="text-2xl font-bold">{logs.length}</p>
                </div>

                <div className="bg-blue-600 text-white rounded-xl px-6 py-4">
                    <p className="text-sm opacity-70">Last 24 Hours</p>
                    <p className="text-2xl font-bold">
                        {
                            logs.filter(
                                (l) =>
                                    Date.now() - new Date(l.createdAt).getTime() <
                                    24 * 60 * 60 * 1000
                            ).length
                        }
                    </p>
                </div>

                <div className="bg-gray-200 text-gray-900 rounded-xl px-6 py-4">
                    <p className="text-sm opacity-70">Unique Admins</p>
                    <p className="text-2xl font-bold">
                        {new Set(logs.map((l) => l.adminId?._id)).size}
                    </p>
                </div>
            </div>

            {/* LOG LIST */}
            <div className="bg-white rounded-xl w-full py-3 px-4 flex flex-col gap-4 border-2 border-gray-300">
                {/* TOP BAR */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center p-1">
                        <h1 className="text-base md:text-lg font-bold">
                            Logs Activity
                        </h1>
                        <div className="h-5 w-5 bg-black text-white rounded-full flex justify-center items-center text-xs">
                            {logs.length}
                        </div>
                    </div>

                    <FaFilter size={20} className="md:w-6 md:h-6" />
                </div>

                {/* LOG ITEMS */}
                {logs.map((log) => (
                    <div
                        key={log._id}
                        className="bg-white rounded-md w-full py-4 px-3 md:px-4 flex flex-col gap-3 border-2 border-gray-300"
                    >
                        {/* TOP */}
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1 flex-1">
                                <h2 className="text-sm md:text-base font-semibold text-gray-800">
                                    {actionLabelMap[log.action] || log.action}
                                </h2>

                                <p className="text-xs text-gray-500">
                                    Performed by{" "}
                                    <span className="font-semibold">
                                        {getAdminFullName(log)}
                                    </span>
                                </p>
                            </div>

                            <span className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                                {log.entityType}
                            </span>
                        </div>

                        {/* META */}
                        {log.meta && (
                            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-700 space-y-1">
                                {log.meta.userId && (
                                    <p>
                                        <span className="font-semibold">User ID:</span>{" "}
                                        {log.meta.userId}
                                    </p>
                                )}
                                {log.meta.points !== undefined && (
                                    <p>
                                        <span className="font-semibold">Points:</span>{" "}
                                        {log.meta.points}
                                    </p>
                                )}
                                {log.meta.rewardType && (
                                    <p>
                                        <span className="font-semibold">Reward Type:</span>{" "}
                                        {log.meta.rewardType}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* FOOTER */}
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>
                                {new Date(log.createdAt).toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>

                            <span className="italic">
                                Entity ID: {log.entityId}
                            </span>
                        </div>
                    </div>
                ))}

                {logs.length === 0 && (
                    <p className="text-center text-sm text-gray-500 py-6">
                        No admin logs found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default AdminLogs;
