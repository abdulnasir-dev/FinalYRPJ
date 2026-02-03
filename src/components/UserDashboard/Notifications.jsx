import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa6";
import { getNotifications, markNotificationRead } from "../../api/userDashboard";
import { LoaderOne } from "../ui/loader";


const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const res = await getNotifications();
                console.log(res.data)
                setNotifications(res.data.notifications);
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const handleRead = async (notificationId, problemId) => {
        try {
            await markNotificationRead(notificationId);
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === notificationId ? { ...n, isRead: true } : n
                )
            );
            navigate(`/problems/${problemId}`);
        } catch (err) {
            console.error("Failed to mark notification as read", err);
        }
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
            {/* Header */}
            <div className="p-1 flex flex-col gap-2">
                <h1 className="text-2xl font-bold">NOTIFICATIONS</h1>
                <p className="text-stone-600">
                    Stay updated on problems related to your expertise.
                </p>
            </div>

            <div className="bg-white rounded-xl w-full py-3 px-4 flex flex-col gap-4 border-2 border-gray-300">
                {/* Top bar */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <h1 className="text-base md:text-lg font-bold">
                            All Notifications -
                        </h1>
                        <div className="h-5 w-5 bg-black text-white rounded-full flex justify-center items-center text-xs">
                            {notifications.length}
                        </div>
                    </div>
                    <FaFilter size={20} className="md:w-6 md:h-6" />
                </div>

                {/* Notifications list */}
                {notifications.map((notification) => {
                    const problem = notification.problemId
                    const postedBy = problem?.createdBy

                    return (
                        <div
                            key={notification._id}
                            className={`rounded-md w-full py-3 px-3 md:px-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3 border-2 
      ${notification.isRead
                                    ? "bg-gray-50 border-gray-200"
                                    : "bg-white border-blue-400"
                                }`}
                        >
                            {/* Left */}
                            <div className="flex flex-col gap-2 flex-1">
                                {/* Problem title */}
                                <h3 className="text-base md:text-lg font-semibold text-gray-800 line-clamp-2">
                                    {problem.title}
                                </h3>

                                {/* Posted by */}
                                <p className="text-sm text-gray-600">
                                    Posted by{" "}
                                    <span className="font-medium">
                                        {postedBy.fullName}
                                    </span>{" "}
                                    ({postedBy.role})
                                </p>

                                {/* Problem created time */}
                                <div className="flex items-center gap-4 text-xs md:text-sm text-gray-500">
                                    <span>
                                        {new Date(problem.createdAt).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>

                                    {!notification.isRead && (
                                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                            New
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Right */}
                            <button
                                onClick={() =>
                                    handleRead(notification._id, problem._id)
                                }
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-xs md:text-sm font-semibold whitespace-nowrap"
                            >
                                View Problem
                            </button>
                        </div>
                    )
                })}


                {notifications.length === 0 && (
                    <p className="text-center text-gray-500 py-6">
                        No notifications found.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Notifications;
