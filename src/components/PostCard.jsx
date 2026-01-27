import { ArrowBigUp, MessageCircle, Share2 } from "lucide-react";

export default function PostCard() {
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-4 w-full">

            {/* Header */}
            <div className="flex items-center justify-between text-sm text-gray-500">
                <span>
                    <span className="font-medium text-gray-700">EcoSolutions</span> • 2 hr ago
                </span>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold leading-tight">
                High Water Bill Due to Leaks
            </h2>

            {/* Image */}
            <div className="h-44 rounded-lg bg-gradient-to-r from-blue-200 to-blue-300" />

            {/* Content */}
            <p className="text-gray-700 text-sm leading-relaxed">
                My water bill has increased suddenly even though my daily water usage hasn’t changed.
                Could this be due to hidden pipe leakage? How do I detect it early?
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">

                {/* Vote */}
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full 
          bg-green-50 text-green-700 hover:bg-green-100 transition">
                    <ArrowBigUp className="w-5 h-5" />
                    <span className="font-medium">2.1k</span>
                </button>

                {/* Comments */}
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-full 
          hover:bg-gray-100 transition text-gray-600">
                    <MessageCircle className="w-4 h-4" />
                    <span>375</span>
                </button>

                {/* Share */}
                <button className="p-2 rounded-full hover:bg-gray-100 transition text-gray-600">
                    <Share2 className="w-4 h-4" />
                </button>

            </div>

        </div>
    );
}
