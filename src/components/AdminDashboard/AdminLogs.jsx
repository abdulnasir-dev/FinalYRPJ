import React, { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { LoaderOne } from "../ui/loader";
import { fetchAdminLogs } from "@/api/admin.users";

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(0)
    const limit = 10;

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const res = await fetchAdminLogs(page, 10);
                console.log(res.data)    
                setLogs(res.data.logs || []);
                setCount(res.data.count)
            } catch (error) {
                console.error("Failed to fetch admin logs", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [page]);

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <LoaderOne />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="p-1 flex flex-col gap-2">
                <h1 className="text-2xl font-bold">ADMIN LOGS</h1>
                <p className="text-stone-600">
                    Complete audit trail of administrative actions.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-black text-white rounded-xl px-6 py-4">
                    <p className="text-sm opacity-70">Total Logs</p>
                    <p className="text-2xl font-bold">{count}</p>
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

            <div className="bg-white rounded-xl w-full py-3 px-4 flex flex-col gap-4 border-2 border-gray-300">
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

                {logs.map((log) => (
                    <div
                        key={log._id}
                        className="bg-white rounded-md w-full py-4 px-3 md:px-4 flex flex-col gap-3 border-2 border-gray-300"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-1 flex-1">
                                <h2 className="text-sm md:text-base font-semibold text-gray-800">
                                    {log.action}
                                </h2>

                                <p className="text-xs text-gray-500">
                                    Performed by{" "}
                                    <span className="font-semibold">
                                        {log.adminId.fullName}
                                    </span>
                                </p>
                            </div>

                            <span className="text-xs px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                                {log.entityType}
                            </span>
                        </div>

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
                                {log.meta.title && (
                                    <p>
                                        <span className="font-semibold">Title: </span> {log.meta.title}
                                       
                                    </p>
                                )}
                                {log.meta.fullName && (
                                    <p>
                                        <span className="font-semibold">User:</span> {log.meta.fullName}
                                    </p>
                                )}
                                {log.meta.bannedUntil && (
                                    <p>
                                        <span className="font-semibold">Banned Until:</span> {new Date(log.meta.bannedUntil).toLocaleString()}
                                    </p>
                                )}
                                {log.meta.userId && (
                                    <p>
                                        <span className="font-semibold">UserId:</span> {log.meta.userId}
                                        
                                    </p>
                                )}

                                {log.meta.ownerId && (
                                    <p>
                                        <span className="font-semibold">OwnerId:</span> {log.meta.ownerId}
                                    </p>
                                )}
                            </div>
                        )}

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

                <div className="flex justify-between items-center pt-2">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 text-sm font-semibold rounded-lg border disabled:opacity-50"
                    >
                        Prev
                    </button>

                    <span className="text-sm font-semibold">Page {page}</span>

                    <button
                        disabled={logs.length < limit}
                        onClick={() => setPage(p => p + 1)}
                        className="px-4 py-2 text-sm font-semibold rounded-lg border disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

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
