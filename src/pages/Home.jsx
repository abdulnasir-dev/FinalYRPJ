import { useState } from "react";
import Sidebar from "../components/Sidebars";
import PostCard from "../components/PostCard";
import MobileSidebar from "../components/RightPanel";
import Navbar from "../components/Navbar";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">

      <Navbar onMenuClick={() => setOpen(true)} />
      <MobileSidebar open={open} onClose={() => setOpen(false)} />

      <div className="flex flex-1 w-full overflow-hidden">

        <Sidebar />

        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <PostCard />
          <PostCard />
          <PostCard />
        </main>

      </div>
    </div>
  );
}
