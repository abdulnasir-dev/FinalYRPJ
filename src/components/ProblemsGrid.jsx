import React from 'react'
import PostCard from './PostCard'

const ProblemsGrid = () => {    
    return (
        <div className="w-full h-full p-2 lg:p-4 bg-[#f5f7f6]
 rounded-lg overflow-hidden">

            {/* Scroll container */}
            <main className="h-full overflow-y-auto no-scrollbar space-y-6 lg:pr-2">

                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />
                <PostCard />

            </main>
        </div>
    )
}

export default ProblemsGrid
