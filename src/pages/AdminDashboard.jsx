import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminDashboardSidebar from "../components/AdminDashboard/AdminSidebar";
import AdminNavbar from "../components/AdminDashboard/AdminNavbar";

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    // Close sidebar on route change (important for mobile)
    useEffect(() => {
        closeSidebar();
    }, [location.pathname]);

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* ADMIN NAVBAR */}
            <AdminNavbar onMenuClick={toggleSidebar} />

            {/* SIDEBAR + CONTENT */}
            <div className="flex flex-1 overflow-hidden">
                <AdminDashboardSidebar open={sidebarOpen} onClose={closeSidebar} />

                <main className="flex-1 overflow-y-auto bg-gray-50 p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
