import { Home, Flame, Compass, Plus } from "lucide-react";



export default function Sidebar() {
  return (
    
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="bg-white rounded-xl p-3 space-y-1">
        <Item icon={<Home />} label="Home" active />
        <Item icon={<Flame />} label="Popular" />
        <Item icon={<Compass />} label="Explore" />
        <hr className="my-3" />
        <Item label="EcoSolutions" />
        <Item label="TechTalk" />
        <button className="w-full mt-3 bg-gray-100 rounded-lg py-2 flex justify-center gap-2">
          <Plus className="w-4 h-4" /> Create Post
        </button>
      </div>
    </aside>
  );
}

function Item({ icon, label, active }) {
  return (
    <div className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
      ${active ? "bg-indigo-50 text-indigo-600" : "hover:bg-gray-100"}`}>
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    

  );
}
