import { Search, Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <nav className="w-full h-16 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6">

      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold">
            E
          </div>
          <span className="text-lg font-semibold text-gray-800 hidden sm:block">
            EcoSphere
          </span>
        </div>
      </div>

      <div className="flex-1 max-w-xl mx-auto hidden md:block">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-400">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search posts, topics, communities..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
        A
      </div>
    </nav>
  );
}
