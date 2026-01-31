import { useState, useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import UserDashboardSidebar from "./UserDashboard/UserDashboardSidebar";
import Sidebars from "./Sidebars";
import Navbar from "./Navbar";

export default function Layout() {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith("/dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    useEffect(() => {
        closeSidebar();
    }, [location.pathname]);

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Navbar spans full width */}
            <Navbar onMenuClick={toggleSidebar} />

            {/* Sidebar + Main content below navbar */}
            <div className="flex flex-1 overflow-hidden">
                {isDashboard ? (
                    <UserDashboardSidebar open={sidebarOpen} onClose={closeSidebar} />
                ) : (
                    <Sidebars open={sidebarOpen} onClose={closeSidebar} />
                )}

                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}