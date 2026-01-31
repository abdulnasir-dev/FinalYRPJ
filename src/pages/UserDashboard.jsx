import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserDashboardSidebar from "../components/UserDashboard/UserDashboardSidebar";

const UserDashboard = () => {
    return (
        <div className="h-screen flex flex-col overflow-hidden">

            {/* Top Navbar */}
            <Navbar />

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar */}
                <UserDashboardSidebar />

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-[#ffffff] p-4">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default UserDashboard;
