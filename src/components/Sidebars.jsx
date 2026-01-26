import React from 'react'
import { NavLink, useLocation } from "react-router-dom";
import { FaHandHoldingWater, FaRecycle, FaLeaf } from "react-icons/fa";
import { MdOutlineLeaderboard, MdOutlineEnergySavingsLeaf, MdLocationCity } from "react-icons/md";
import { FiHome } from "react-icons/fi";
import { Trash } from 'lucide-react';
import { HiMiniSignal } from "react-icons/hi2";
import { PiPottedPlantLight } from "react-icons/pi";
import { GiFarmer } from "react-icons/gi";
import { TbWorld } from "react-icons/tb";
import { MdOutlineAir } from "react-icons/md";

const Sidebars = () => {
  const { pathname } = useLocation();

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

  return (
    <div className="hidden lg:block h-full w-[20%] rounded-lg bg-[#F3F4F6]">

      <div className="flex flex-col gap-5 p-3">
        <h2 className="font-bold">Discover</h2>

        <div className="flex flex-col gap-4 px-1">
          {discover.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex gap-3 items-center px-2 py-1 rounded-md transition 
                ${isActive ? "bg-green-200 text-green-700" : "hover:text-green-600"}`}
              >
                <Icon size={22} />
                <h3 className="font-semibold">{item.label}</h3>
              </NavLink>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-5 p-3">
        <h2 className="font-bold">Categories</h2>

        <div className="flex flex-col gap-4 px-1">
          {categories.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="flex gap-3 items-center cursor-pointer hover:text-green-600 transition"
              >
                <Icon size={22} />
                <h3 className="font-semibold">{item.label}</h3>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default Sidebars;
