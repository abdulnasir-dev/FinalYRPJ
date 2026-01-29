import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { FaHandHoldingWater, FaRecycle, FaLeaf } from "react-icons/fa";
import {
  MdOutlineLeaderboard,
  MdOutlineEnergySavingsLeaf,
  MdLocationCity,
  MdOutlineAir
} from "react-icons/md";
import { FiHome } from "react-icons/fi";
import { Trash } from "lucide-react";
import { HiMiniSignal } from "react-icons/hi2";
import { PiPottedPlantLight } from "react-icons/pi";
import { GiFarmer } from "react-icons/gi";
import { TbWorld } from "react-icons/tb";

const discover = [
  { label: "Home", icon: FiHome, path: "/" },
  { label: "Leaderboard", icon: MdOutlineLeaderboard, path: "/leaderboard" },
  { label: "EcoSnaps", icon: HiMiniSignal, path: "/ecosnaps" },
];

const categories = [
  { label: "Water Conservation", icon: FaHandHoldingWater, id: "water_conservation" },
  { label: "Food Waste", icon: Trash, id: "food_waste" },
  { label: "Energy Efficiency", icon: MdOutlineEnergySavingsLeaf, id: "energy_efficiency" },
  { label: "Waste Management", icon: FaRecycle, id: "waste_management" },
  { label: "Sustainable Agriculture", icon: GiFarmer, id: "sustainable_agriculture" },
  { label: "Air Pollution", icon: MdOutlineAir, id: "air_pollution" },
  { label: "Plastic Reduction", icon: PiPottedPlantLight, id: "plastic_reduction" },
  { label: "Urban Sustainability", icon: MdLocationCity, id: "urban_sustainability" },
  { label: "Climate Awareness", icon: TbWorld, id: "climate_awareness" },
  { label: "Eco-Friendly Living", icon: FaLeaf, id: "eco_friendly_living" },
];

const SidebarContent = ({ onClose }) => {
  const { pathname } = useLocation();
  const [showCategories, setShowCategories] = useState(true);

  return (
    <div className="h-full bg-white rounded-lg">
      <div className="flex flex-col h-auto rounded-lg bg-gray-50 overflow-hidden">

        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden bg-white">
          <span className="font-bold text-lg text-gray-900">Menu</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="flex flex-col gap-3 p-4 lg:p-3">
          <h2 className="font-bold text-sm uppercase tracking-wide text-gray-700">Discover</h2>

          <div className="flex flex-col gap-1">
            {discover.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex gap-3 items-center px-3 py-2.5 rounded-lg transition-all duration-200 
                ${isActive
                      ? "bg-green-100 text-green-700 font-semibold shadow-sm"
                      : "text-gray-700 hover:bg-gray-100 hover:text-green-600"
                    }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <h3 className="font-medium text-sm">{item.label}</h3>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col p-4 lg:p-3 flex-1 overflow-hidden border-t border-gray-200">
          <button
            className="flex items-center justify-between cursor-pointer select-none py-2 px-1 -mx-1 rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => setShowCategories((prev) => !prev)}
            aria-expanded={showCategories}
          >
            <h2 className="font-bold text-sm uppercase tracking-wide text-gray-700">Categories</h2>
            <span className="text-xl font-bold text-gray-600 w-6 h-6 flex items-center justify-center">
              {showCategories ? "−" : "+"}
            </span>
          </button>

          <div
            className={`transition-all duration-300 ease-in-out overflow-y-auto 
          ${showCategories ? "max-h-[calc(100vh-300px)] sm:max-h-[60vh] mt-3 opacity-100" : "max-h-0 opacity-0"}`}
          >
            <div className="flex flex-col gap-1 pr-1">
              {categories.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.id}
                    className="flex gap-3 items-center px-3 py-2.5 cursor-pointer text-gray-700 
                  hover:bg-gray-100 hover:text-green-600 rounded-lg transition-all duration-200"
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <h3 className="font-medium text-sm">{item.label}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default function Sidebars({ open, onClose }) {
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex h-screen w-[260px] min-w-[240px] flex-col rounded-lg overflow-hidden shadow-sm border border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${open ? "visible opacity-100" : "invisible opacity-0"
          }`}
      >
        {/* Backdrop */}
        <div
          onClick={onClose}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"
            }`}
        />

        {/* Drawer */}
        <div
          className={`absolute left-0 top-0 h-full w-[280px] sm:w-[300px] bg-gray-50 shadow-2xl 
          transform transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <SidebarContent onClose={onClose} />
        </div>
      </div>
    </>
  );
}