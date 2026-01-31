import React from 'react'

const Overview = () => {

    const recentProblems = [
        {
            title: "Water Drainage",
            description: "Efficient removal of excess water to prevent flooding",
        },
        {
            title: "Waste Management",
            description: "Proper collection and disposal to reduce pollution",
        },
        {
            title: "Energy Conservation",
            description: "Optimized usage to minimize energy wastage",
        },
    ];


    return (
        <div className='flex flex-col gap-5'>
            <div className='p-1 flex flex-col gap-2'>
                <h1 className='text-2xl font-bold'>OVERVIEW</h1>
                <p className='text-stone-600'>This is the overview section of your dashboard.</p>
            </div>

            <div className="flex flex-col lg:flex-row w-full justify-center items-stretch gap-4 p-3">
                <div className='bg-white rounded-xl lg:w-1/3 h-full py-3 px-4 flex justify-center items-center border-2 border-gray-300'>
                    <div className='w-1/2 h-full flex flex-col justify-between'>
                        <h3 className=' font-bold text-sm text-[#848484]'>Total Problems</h3>
                        <p className='text-4xl font-bold py-2 pl-2 '>150</p>
                        <p className='text-sm font-bold text-[#848484]'>Past 30 Days</p>
                    </div>

                    <div className='w-1/2 bg-green-300 h-full'>

                    </div>
                </div>


                <div className='bg-white rounded-xl lg:w-1/3 h-full py-3 px-4 flex justify-center items-center border-2 border-gray-300'>
                    <div className='w-1/2 h-full flex flex-col justify-between'>
                        <h3 className=' font-bold text-sm text-[#848484]'>Total Problems</h3>
                        <p className='text-4xl font-bold py-2 pl-2 '>150</p>
                        <p className='text-sm font-bold text-[#848484]'>Past 30 Days</p>
                    </div>

                    <div className='w-1/2 bg-green-300 '>

                    </div>
                </div>


                <div className='bg-white rounded-xl lg:w-1/3 h-full py-3 px-4 flex justify-center items-center border-2 border-gray-300'>
                    <div className='w-1/2 h-full flex flex-col justify-between'>
                        <h3 className=' font-bold text-sm text-[#848484]'>Total Problems</h3>
                        <p className='text-4xl font-bold py-2 pl-2 '>150</p>
                        <p className='text-sm font-bold text-[#848484]'>Past 30 Days</p>
                    </div>

                    <div className='w-1/2 bg-green-300 h-full'>

                    </div>
                </div>


            </div>

            {/* CHART AREA */}
            <div className='flex flex-col px-3 gap-3'>
                <h1 className='text-xl font-bold'>Statics</h1>
                <div className='flex gap-4 flex-col lg:flex lg:flex-row'>
                    <div className="lg:w-1/4 h-[300px] bg-white border-2 border-gray-300 rounded-2xl p-3 flex flex-col">
                        <h2 className="text-lg font-bold text-[#444]">Problem Status</h2>

                        <div className="flex-1 w-full bg-orange-300 rounded-lg mt-2">
                        </div>
                    </div>


                    <div className='flex flex-col    lg:w-3/4 h-[300px] bg-white border-2 border-gray-300 rounded-2xl  p-3  '>
                        <h2 className="text-lg font-bold text-[#444]">Soltion History</h2>

                        <div className="flex-1 w-full bg-orange-300 rounded-lg mt-2">
                        </div>
                    </div>
                </div>
            </div>

            {/* RECENT POSTS AND ACTIVITY */}
            <div className='flex flex-col p-3 gap-3'>

                <div className='flex flex-col w-full rounded-2xl border-2 border-gray-300 bg-white'>
                    <div className='flex flex-col gap-1 p-3'>
                        <h1 className='text-xl font-bold'>Recent Activities</h1>
                        <p className='text-sm  text-[#848484]'>View key metrices for recent posts</p>
                    </div>

                    <div className='flex flex-col gap-4'>
                        <div>
                            <div className='h-10 border-y-2 border-gray-300 flex items-center px-3 bg-[#f9fbfc]'>
                                <h2 className="text-sm font-bold text-[#666]">Posted Problems</h2>
                            </div>

                            <div className="flex flex-col">
                                {recentProblems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-3 p-3 items-center border-t-2 border-gray-200"
                                    >
                                        {/* Serial Number */}
                                        <span className="text-sm font-bold text-gray-500">
                                            {index + 1}.
                                        </span>

                                        {/* Content */}
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                                            <h3 className="text-md font-semibold text-gray-800">
                                                {item.title}
                                            </h3>

                                            <span className="hidden lg:inline text-gray-400">–</span>

                                            <h4 className="text-sm text-gray-800">
                                                {item.description}
                                            </h4>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <div className='h-10 border-y-2 border-gray-300 flex items-center px-3 bg-[#f9fbfc]'>
                                <h2 className="text-sm font-bold text-[#666]">Posted Solutions</h2>
                            </div>

                            <div className="flex flex-col">
                                {recentProblems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex  gap-3 p-3 items-center border-t -2 border-gray-200"
                                    >
                                        {/* Serial Number */}
                                        <span className="text-sm font-bold text-gray-500">
                                            {index + 1}.
                                        </span>

                                        {/* Content */}
                                        <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-2">
                                            <h3 className="text-md font-semibold text-gray-800">
                                                {item.title}
                                            </h3>

                                            <span className="hidden lg:inline text-gray-400">–</span>

                                            <h4 className="text-sm text-gray-800">
                                                {item.description}
                                            </h4>
                                        </div>

                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>



                </div>
            </div>

        </div>
    )
}

export default Overview