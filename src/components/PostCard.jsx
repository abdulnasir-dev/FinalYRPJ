import { ArrowBigUp, MessageCircle, Share2 } from "lucide-react";

export default function PostCard() {
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">

            <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">EcoSolutions</span> • 2 hr ago
            </div>

            <h2 className="text-xl font-semibold">
                High Water Bill Due to Leaks
            </h2>

            <div className="h-40 rounded-lg bg-gradient-to-r from-blue-200 to-blue-300" />

            <p className="text-gray-700 text-sm">
                My water bill has increased suddenly even though my daily water usage hasn’t changed...
            </p>

            <div className="flex gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1 text-green-600">
                    <ArrowBigUp className="w-5 h-5" /> 2.1k
                </span>
                <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" /> 375
                </span>
                <Share2 className="w-4 h-4 cursor-pointer" />
            </div>

        </div>
    );
}
