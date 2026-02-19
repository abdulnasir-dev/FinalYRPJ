import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaFilter } from "react-icons/fa6";
import {
  getNotifications,
  markNotificationRead,
} from "../../api/userDashboard";
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

      if (problemId) {
        navigate(`/problems/${problemId}`);
      }
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
    <div className="flex flex-col gap-8 h-full bg-gradient-to-br from-slate-50 to-white p-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-8 py-7">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-emerald-900 to-teal-400 bg-clip-text text-transparent">
          Notifications
        </h1>

        <p className="text-slate-500 text-sm mt-3">
          Stay updated on activity related to your problems and solutions.
        </p>
      </div>

      {/* MAIN CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 flex flex-col gap-6">

        {/* TOP BAR */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800">
              All Notifications
            </h2>

            <span className="px-3 py-1 text-xs font-semibold bg-slate-900 text-white rounded-full">
              {notifications.length}
            </span>
          </div>

          <FaFilter size={18} className="text-slate-400" />
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-5">

          {notifications.length === 0 && (
            <div className="text-center py-14 text-slate-400 text-sm">
              No notifications found.
            </div>
          )}

          {notifications.map((notification) => {
            const problem = notification.problemId;
            const isGlobal = !problem;

            return (
              <div
                key={notification._id}
                onClick={() =>
                  handleRead(
                    notification._id,
                    problem?._id
                  )
                }
                className={`cursor-pointer p-6 rounded-xl border transition-all duration-200 
                ${
                  notification.isRead
                    ? "bg-slate-50 border-slate-200"
                    : "bg-white border-emerald-400 shadow-sm hover:shadow-md"
                }`}
              >

                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

                  {/* LEFT */}
                  <div className="flex flex-col gap-2 flex-1">

                    <h3 className="text-base font-semibold text-slate-900 leading-snug">
                      {isGlobal
                        ? "System Notification"
                        : problem.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {notification.message}
                    </p>

                    {!notification.isRead && (
                      <span className="w-fit px-3 py-1 text-xs font-semibold uppercase tracking-wide bg-emerald-100 text-emerald-700 rounded-full">
                        New
                      </span>
                    )}
                  </div>

                  {/* RIGHT */}
                  {!isGlobal && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRead(
                          notification._id,
                          problem._id
                        );
                      }}
                      className="px-5 py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
                    >
                      View Problem
                    </button>
                  )}

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default Notifications;
