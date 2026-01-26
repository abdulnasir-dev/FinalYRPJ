import { Search, Mail, Bell, ChevronDown, Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-[1500px] mx-auto  h-14 flex items-center justify-around mr-70">

        {/* Hamburger (md & sm only) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold text-lg">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
            T
          </div>
          Threadly
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search Threadly"
            className="w-full rounded-full bg-gray-100 pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Icons */}
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-gray-600 cursor-pointer" />
          <Bell className="w-5 h-5 text-gray-600 cursor-pointer" />
          <div className="flex items-center gap-2 cursor-pointer">
            <img src="https://i.pravatar.cc/40" className="w-8 h-8 rounded-full" />
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>

      </div>
    </nav>
  );
}
    