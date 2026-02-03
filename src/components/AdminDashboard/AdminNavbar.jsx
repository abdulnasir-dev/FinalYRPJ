import {
    Search,
    Menu,
    Bell,
    ChevronDown,
    LogOut,
    User,
    Settings as SettingsIcon,
    FileText,
    Leaf,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar({ onMenuClick }) {
    const [openProfile, setOpenProfile] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const handleNavigate = (path) => {
        setOpenProfile(false);
        navigate(path);
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        window.location.href = "/signin";
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenProfile(false);
            }
        };

        if (openProfile) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openProfile]);

    return (
        <nav className="w-full h-16 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 lg:px-8 shadow-sm">
            {/* LEFT */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
                >
                    <Menu className="w-5 h-5 text-gray-700" />
                </button>

                <div
                    onClick={() => navigate("/admin")}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <div  className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center text-white">
                        <Leaf className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-semibold text-gray-900 hidden sm:block">
                        ImpactHub Admin
                    </span>
                </div>
            </div>

            {/* CENTER SEARCH */}
            <div className="flex-1 max-w-xl mx-auto hidden md:block px-6">
                <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
                    <Search className="w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search users, problems, reports…"
                        className="w-full bg-transparent outline-none text-sm"
                    />
                </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3 ml-auto">
                <button className="md:hidden p-2 rounded-md hover:bg-gray-100">
                    <Search className="w-5 h-5 text-gray-700" />
                </button>

                <button
                    onClick={() => navigate("/admin/notifications")}
                    className="p-2 rounded-md hover:bg-gray-100"
                >
                    <Bell className="w-5 h-5 text-gray-700" />
                </button>

                {/* PROFILE DROPDOWN */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setOpenProfile((prev) => !prev)}
                        className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100"
                    >
                        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
                            A
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-600 hidden sm:block" />
                    </button>

                    {openProfile && (
                        <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                            <DropdownItem
                                icon={<User size={16} />}
                                label="User Dashboard"
                                onClick={() => handleNavigate("/dashboard")}
                            />
                            <DropdownItem
                                icon={<FileText size={16} />}
                                label="Admin Dashboard"
                                onClick={() => handleNavigate("/admin")}
                            />
                            <DropdownItem
                                icon={<SettingsIcon size={16} />}
                                label="Settings"
                                onClick={() => handleNavigate("/dashboard/settings")}
                            />

                            <div className="border-t border-gray-200 my-1" />

                            <DropdownItem
                                icon={<LogOut size={16} />}
                                label="Logout"
                                danger
                                onClick={handleLogout}
                            />
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

function DropdownItem({ icon, label, onClick, danger = false }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition
        ${danger
                    ? "text-red-600 hover:bg-red-50"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}
