import {
  X,
  Home,
  Flame,
  Compass,
  Plus,
  Settings,
} from "lucide-react";

export default function MobileSidebar({ open, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity
        ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50
        transform transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        shadow-2xl rounded-r-2xl`}
      >
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
              T
            </div>
            Threadly
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <div className="px-4 py-4 space-y-6">

          {/* MAIN */}
          <div>
            <p className="text-xs uppercase text-gray-400 mb-2">Main</p>
            <NavItem icon={<Home />} label="Home" active />
            <NavItem icon={<Flame />} label="Popular" />
            <NavItem icon={<Compass />} label="Explore" />
          </div>

          {/* ACTION */}
          <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-700">
            <Plus className="w-4 h-4" /> Create Post
          </button>

        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full p-4 border-t flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            className="w-9 h-9 rounded-full"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-gray-500">View profile</p>
          </div>
          <Settings className="w-5 h-5 text-gray-500" />
        </div>
      </aside>
    </>
  );
}

/* ---------- Nav Item ---------- */
function NavItem({ icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer
      ${
        active
          ? "bg-indigo-50 text-indigo-600"
          : "hover:bg-gray-100"
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
