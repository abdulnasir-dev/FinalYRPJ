import { searchRequest } from "@/api/search.api";
import { userAvatar } from "@/api/user.api";
import { Search, Menu, Bell, ChevronDown, LogOut, User, Settings as SettingsIcon, FileText, Leaf, } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ onMenuClick }) {
  const [openProfile, setOpenProfile] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchType, setSearchType] = useState("problem");
  const [openSearch, setOpenSearch] = useState(false);

  const handleNavigate = (path) => {
    setOpenProfile(false);
    navigate(path);
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await searchRequest({
          type: searchType,
          query: searchQuery,
        });
        console.log(res.data)
        setResults(res.data.results);
        setShowResults(true);
      } catch (err) {
        console.error(err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, searchType]);

  // Fetch avatar
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const res = await userAvatar();
        setAvatar(res.data.coverImage);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAvatar();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/signin";
  };

  // Close profile dropdown
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

        {/* Brand */}
        <div
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center text-white">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="text-lg font-semibold text-gray-900 hidden sm:block">
            ImpactHub
          </span>
        </div>
      </div>

      {/* CENTER SEARCH (DESKTOP) */}
      <div className="flex-1 max-w-xl mx-auto hidden md:block px-6">
        <div className="relative flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="bg-transparent text-sm outline-none border-r pr-2 text-gray-600"
          >
            <option value="problem">Problem</option>
            <option value="user">User</option>
          </select>

          <Search className="w-4 h-4 text-gray-500" />

          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${searchType}s...`}
              className="w-full bg-transparent outline-none text-sm"
              onFocus={() => setShowResults(true)}

            />

            {showResults && results.length > 0 && (
              <div className="absolute top-10 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {results.map((item) => (
                  <div
                    key={item._id}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                    onClick={() => {
                      if (searchType === "problem") {
                        navigate(`/problems/${item._id}`);
                      } else {
                        navigate(`/dashboard/profile/${item._id}`);
                      }
                      setShowResults(false);
                    }}
                  >
                    {searchType === "problem"
                      ? item.title
                      : (
                        <div className="flex items-center gap-2">
                          {item.coverImage ? (
                            <img
                              src={item.coverImage}
                              alt="avatar"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <User size={16} className="text-gray-500" />
                            </div>
                          )}
                          <span>{item.fullName}</span>
                        </div>
                      )
                    } 

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Mobile search button */}
        <button
          onClick={() => setOpenSearch(true)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <Search className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={() => navigate("/dashboard/notifications")}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <Bell className="w-5 h-5 text-gray-700" />
        </button>

        {/* USER DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpenProfile((prev) => !prev)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100"
          >
            <div className="w-9 h-9 rounded-full bg-green-100 overflow-hidden flex items-center justify-center">
              {avatar ? (
                <img
                  src={avatar}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-green-700 font-semibold">U</span>
              )}
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
              <DropdownItem
                icon={<User size={16} />}
                label="Profile"
                onClick={() => handleNavigate("/dashboard/my-profile")}
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

      {/* MOBILE SEARCH MODAL */}
      {openSearch && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-24"
          onClick={() => setOpenSearch(false)}
        >
          <div
            className="w-[90%] max-w-md bg-white rounded-xl shadow-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-700">Search</h2>
              <button
                onClick={() => setOpenSearch(false)}
                className="text-gray-500 text-sm"
              >
                Close
              </button>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="bg-transparent text-sm outline-none border-r pr-2 text-gray-600"
              >
                <option value="problem">Problem</option>
                <option value="user">User</option>
              </select>

              <Search className="w-4 h-4 text-gray-500" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${searchType}s...`}
                className="w-full bg-transparent outline-none text-sm"
                autoFocus
              />
            </div>

            {results.length > 0 && (
              <div className="mt-3 bg-white border border-gray-200 rounded-lg overflow-hidden">
                {results.map((item) => (
                  <div
                    key={item._id}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                    onClick={() => {
                      if (searchType === "problem") {
                        navigate(`/problems/${item._id}`);
                      } else {
                        navigate(`/dashboard/profile/${item._id}`);
                      }
                      setOpenSearch(false);
                    }}
                  >
                    {searchType === "problem"
                      ? item.title
                      : (
                        <div className="flex items-center gap-2">
                          {item.coverImage ? (
                            <img
                              src={item.coverImage}
                              alt="avatar"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <User size={16} className="text-gray-500" />
                            </div>
                          )}
                          <span>{item.fullName}</span>
                        </div>
                      )
                    }

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
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
