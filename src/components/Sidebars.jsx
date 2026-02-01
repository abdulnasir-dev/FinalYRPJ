import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, X } from "lucide-react";
import { FiHome } from "react-icons/fi";
import { MdOutlineLeaderboard, MdOutlineEnergySavingsLeaf, MdLocationCity, MdOutlineAir } from "react-icons/md";
import { FaHandHoldingWater, FaRecycle, FaLeaf } from "react-icons/fa";
import { Trash } from "lucide-react";
import { HiMiniSignal } from "react-icons/hi2";
import { PiPottedPlantLight } from "react-icons/pi";
import { GiFarmer } from "react-icons/gi";
import { TbWorld } from "react-icons/tb";

const discover = [
  { label: "Home", icon: FiHome, path: "/" },
  { label: "Leaderboard", icon: MdOutlineLeaderboard, path: "/leaderboard" },
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
];

const categories = [
  { label: "Water Conservation", icon: FaHandHoldingWater },
  { label: "Food Waste", icon: Trash },
  { label: "Energy Efficiency", icon: MdOutlineEnergySavingsLeaf },
  { label: "Waste Management", icon: FaRecycle },
  { label: "Sustainable Agriculture", icon: GiFarmer },
  { label: "Air Pollution", icon: MdOutlineAir },
  { label: "Plastic Reduction", icon: PiPottedPlantLight },
  { label: "Urban Sustainability", icon: MdLocationCity },
  { label: "Climate Awareness", icon: TbWorld },
  { label: "Eco-Friendly Living", icon: FaLeaf },
];

const SidebarContent = ({ onClose }) => {
  const { pathname } = useLocation();
  const [showCategories, setShowCategories] = useState(true);

  return (
    <div className="h-full bg-white">
      <div className="flex flex-col h-full bg-gray-50 overflow-hidden">

        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden bg-white">
          <span className="font-bold text-lg text-gray-900">Explore</span>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 transition">
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* DISCOVER (matches dashboard nav UI) */}
        <div className="flex flex-col gap-3 p-4 lg:p-3">
          <h2 className="font-bold text-xs uppercase tracking-wide text-gray-500">
            Discover
          </h2>

          <div className="flex flex-col gap-[5px]">
            {discover.map((item) => {
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

        {/* CATEGORIES (same UI rules as dashboard list) */}
        <div className="flex flex-col flex-1 overflow-hidden border-t border-gray-200 p-4 lg:p-3">

          <button
            onClick={() => setShowCategories((p) => !p)}
            className="flex items-center justify-between px-1 py-2 -mx-1 rounded-md hover:bg-gray-100 transition"
          >
            <h2 className="font-bold text-xs uppercase tracking-wide text-gray-500">
              Categories
            </h2>
            <span className="text-lg font-bold text-gray-600">
              {showCategories ? "−" : "+"}
            </span>
          </button>

          {showCategories && (
            <div className="mt-3 flex-1 overflow-y-auto space-y-[5px] pr-1">
              {categories.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={index}
                    className="flex gap-3 rounded-md items-center px-3 py-2.5 text-gray-700
                      hover:bg-gray-100 cursor-pointer transition"
                  >
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Sidebars({ open, onClose }) {

  return (
    <>
      <div className="hidden lg:flex h-screen w-[260px] min-w-[240px] flex-col overflow-hidden shadow-sm border-r border-gray-200 bg-white">
        <SidebarContent />
      </div>

      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300
        ${open ? "visible opacity-100" : "invisible opacity-0"}`}
      >
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/50"
        />

        {/* Drawer */}
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