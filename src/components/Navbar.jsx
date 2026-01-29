import { Search, Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <nav className="w-full h-16 bg-white border-b border-gray-200 flex items-center px-4 rounded-lg sm:px-6 lg:px-8 shadow-sm">

      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold shadow-sm">
            E
          </div>
          <span className="text-lg sm:text-xl font-semibold text-gray-900 hidden sm:block">
            EcoSphere
          </span>
        </div>
      </div>

      {/* Desktop Search */}
      <div className="flex-1 max-w-xl mx-auto hidden md:block px-4 lg:px-6">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 
        focus-within:border-green-400 focus-within:ring-2 focus-within:ring-green-100 transition-all">
          <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search posts, topics, communities..."
            className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Mobile Search Icon */}
      <button
        className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors ml-auto mr-2"
        aria-label="Search"
      >
        <Search className="w-5 h-5 text-gray-700" />
      </button>

      {/* User Avatar */}
      <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold 
      cursor-pointer hover:bg-green-200 transition-colors shadow-sm">
        A
      </div>
    </nav>
  );
}