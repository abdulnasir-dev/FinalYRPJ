import { useState } from "react";
import Sidebar from "../components/Sidebars";
import PostCard from "../components/PostCard";
import CommentCard from "../components/CommentCard";
import MobileSidebar from "../components/RightPanel";
import Navbar from "../components/Navbar";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Navbar onMenuClick={() => setOpen(true)} />
      <MobileSidebar open={open} onClose={() => setOpen(false)} />

      <div className="max-w-[1500px] mx-auto px-4 py-6 flex gap-6">
        <Sidebar />

        <main className="flex-1 space-y-6">
          <PostCard />
        </main>


      </div>
    </>
  );
}
