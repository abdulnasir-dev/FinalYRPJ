import { useState } from "react";
import Sidebar from "../components/Sidebars";
import PostCard from "../components/PostCard";
import CommentCard from "../components/CommentCard";
import MobileSidebar from "../components/RightPanel";
import Navbar from "../components/Navbar";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-screen flex overflow-hidden">
      {/* Navbar + Mobile Sidebar */}
      {/* <Navbar onMenuClick={() => setOpen(true)} /> */}
      {/* <MobileSidebar open={open} onClose={() => setOpen(false)} /> */}

      {/* Desktop Layout */}
      <div className="flex w-full">

        {/* Sidebar */}
        <Sidebar />

        {/* Main Feed */}
        <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <PostCard />
          <CommentCard />
          <PostCard />
          <CommentCard />
        </main>

      </div>
    </div>
  );
}
