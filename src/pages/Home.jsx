import { useState } from "react";
import Sidebar from "../components/Sidebars";
import Navbar from "../components/Navbar";
import ProblemsGrid from "../components/ProblemsGrid";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    // Full viewport wrapper
    <div className="w-full min-h-screen bg-[#dfdfdf] p-4">

      {/* Main layout container */}
      <div className="w-full h-[calc(100vh-32px)] flex flex-col gap-4 overflow-hidden">

        {/* Top Navbar */}
        <Navbar onMenuClick={() => setOpen(true)} />

        {/* Body Section */}
        <div className="flex flex-1 gap-4 overflow-hidden">
          <Sidebar />

          <div className="flex-1 overflow-hidden">
            <ProblemsGrid />
          </div>

        </div>

      </div>
    </div>
  );
}
