import React from "react";
import workImage from "../../assets/work.webp";

const Settings = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-4 text-center">
      {/* Image */}
      <img
        src={workImage}
        alt="Work in progress"
        className="w-64 md:w-80 lg:w-96 mb-6"
      />

      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
        Work in Progress 🚧
      </h1>

      {/* Subtitle */}
      <p className="text-sm md:text-base text-gray-600 max-w-md">
        We’re building something cool here.
        Settings and personalization features will be available soon.
      </p>

      {/* Optional badge / hint */}
      <div className="mt-4 px-4 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
        Coming Soon
      </div>
    </div>
  );
};

export default Settings;
