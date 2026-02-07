import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Bell, PlusCircle, User, X } from "lucide-react";
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    Star,
    Settings,
    LogOut,
    Gift,
} from "lucide-react";
import { FiHome } from "react-icons/fi";

const dashboardNav = [
    { label: "Home", icon: FiHome, path: "/" },
    { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { label: "My Problems", icon: FileText, path: "/dashboard/problems" },
    { label: "My Solutions", icon: MessageSquare, path: "/dashboard/solutions" },
    { label: "Points & Rewards", icon: Star, path: "/dashboard/points" },
    { label: "Redemption", icon: Gift, path: "/dashboard/redemption" },
    { label: "Create Problem", icon: PlusCircle, path: "/dashboard/create" },
    { label: "Notifications", icon: Bell, path: "/dashboard/notifications" },
    { label: "Profile", icon: User, path: "/dashboard/profile" },
    { label: "Settings", icon: Settings, path: "/dashboard/settings" },
];

const SidebarContent = ({ onClose }) => {
    const { pathname } = useLocation();

    const handleLogout = () => {
        // console.log("clicked")
        localStorage.removeItem("accessToken");
        window.location.href = "/signin";
    };

    return (
        <div className="h-full bg-white">
            <div className="flex flex-col h-full bg-gray-50 overflow-hidden">

                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden bg-white">
                    <span className="font-bold text-lg text-gray-900">Dashboard</span>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-700" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex flex-col gap-3 p-4 lg:p-3 flex-1">
                    <h2 className="font-bold text-xs uppercase tracking-wide text-gray-500">
                        User Panel
                    </h2>

                    <div className="flex flex-col gap-[5px]">
                        {dashboardNav.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={onClose}
                                    className={`flex gap-3 rounded-md items-center px-3 py-2.5 transition-all duration-200 
                    ${isActive
                                            ? "bg-black text-white font-semibold"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span className="text-sm">{item.label}</span>
                                </NavLink>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200">
                    <button onClick={handleLogout} className="flex gap-3 items-center px-3 py-2.5 w-full text-sm text-red-600 hover:bg-red-50 transition">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function UserDashboardSidebar({ open, onClose }) {

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex h-screen w-[260px] min-w-[240px] flex-col overflow-hidden shadow-sm border-r border-gray-200 bg-white">
                <SidebarContent />
            </div>

            {/* Mobile Drawer */}
            <div
                className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300
          ${open ? "visible opacity-100" : "invisible opacity-0"}`}
            >
                <div
                    onClick={onClose}
                    className="absolute inset-0 bg-black/50"
                />

                <div
                    className={`absolute left-0 top-0 h-full w-[280px] sm:w-[300px] bg-gray-50 shadow-2xl
            transform transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <SidebarContent onClose={onClose} />
                </div>
            </div>
        </>
    );
}