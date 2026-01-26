import { Award, Share2 } from "lucide-react";

export default function CommentCard() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm space-y-3">

      <div className="flex items-center gap-3">
        <img src="https://i.pravatar.cc/50" className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-medium">
            Abdul Maqsad
            <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
              Expert
            </span>
          </p>
          <p className="text-xs text-gray-500">2 hr ago</p>
        </div>
      </div>

      <p className="text-sm text-gray-700">
        If your water bill has increased suddenly, start by turning off all taps and appliances...
      </p>

      <div className="flex gap-4 text-sm text-gray-500">
        <span>842</span>
        <span>Reply</span>
        <span className="flex items-center gap-1">
          <Award className="w-4 h-4" /> Award
        </span>
        <Share2 className="w-4 h-4" />
      </div>

    </div>
  );
}
