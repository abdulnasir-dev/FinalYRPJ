import { ArrowBigUp, MessageCircle, Share2 } from "lucide-react";

export default function PostCard() {
    return (
        <div className="card relative group rounded-xl p-[1px] overflow-hidden">

            {/* <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition">
                <div className="absolute inset-0 rounded-xl border border-transparent bg-[conic-gradient(from_0deg,#22c55e,transparent,transparent,#22c55e)] animate-spin-slow" />
            </div> */}

            <div className="relative bg-white rounded-xl p-4 md:p-4 shadow-sm hover:shadow-md transition-shadow w-full flex flex-col md:flex-row gap-3 md:gap-4">

                <div className="flex-1 space-y-2">

                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                            <span className="font-medium text-gray-700">Username</span> • 2 hr ago
                        </span>
                    </div>

                    <h2 className="text-lg font-semibold leading-snug text-gray-900">
                        High Water Bill Due to Leaks
                    </h2>

                    <div className="md:hidden h-36 w-full rounded-lg bg-gradient-to-r from-blue-200 to-blue-300" />

                    <p className="hidden md:block text-gray-700 text-sm leading-relaxed line-clamp-2">
                        My water bill has increased suddenly even though my daily water usage hasn’t changed.
                        Could this be due to hidden pipe leakage? How do I detect it early?
                    </p>

                    <div className="flex items-center justify-between pt-1">

                        <div className="flex gap-3">
                            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-full 
                bg-green-50 text-green-700 hover:bg-green-100 transition text-sm">
                                <ArrowBigUp className="w-4 h-4" />
                                <span className="font-medium">2.1k</span>
                            </button>

                            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-full 
                hover:bg-gray-100 transition text-gray-600 text-sm">
                                <MessageCircle className="w-4 h-4" />
                                <span>375</span>
                            </button>

                            <button className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-600">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>

                    </div>
                </div>

                <div className="hidden md:flex items-center">
                    <div className="w-80 h-28 rounded-lg bg-gradient-to-r from-blue-200 to-blue-300" />
                </div>


            </div>
        </div>
    );
}
