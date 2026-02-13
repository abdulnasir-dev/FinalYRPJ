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

    const [selectedCategory, setSelectedCategory] = useState("all");


    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Navbar spans full width */}
            <Navbar onMenuClick={toggleSidebar} />

            {/* Sidebar + Main content below navbar */}
            <div className="flex flex-1 overflow-hidden">
                {isDashboard ? (
                    <UserDashboardSidebar open={sidebarOpen} onClose={closeSidebar} />
                ) : (
                    <Sidebars
  open={sidebarOpen}
  onClose={closeSidebar}
  onCategorySelect={setSelectedCategory}
/>

                )}

                <main className="flex-1 overflow-y-auto">
<Outlet context={{ selectedCategory, setSelectedCategory }} />
                </main>
            </div>
        </div>
    );
}