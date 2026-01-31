import React, { useEffect, useState } from 'react'
import { dashboardStats } from '../../api/user.api';
import ReusablePieChart from '../charts/ReusablePieChart';
import ReusableLineChart from '../charts/ReusableLineChart';
import MiniLineChart from '../charts/MiniLineChart';


const Overview = () => {

    const [loading, setLoading] = useState(true);
    const [totalProblems, setTotalProblems] = useState(0)
    const [totalSolutions, setTotalSolutions] = useState(0)
    const [totalSolutionsRecieved, setTotalSolutionsRecieved] = useState(0)

    const [problemsStatus, setProblemsStatus] = useState([])
    const [latestProblems, setLatestProblems] = useState([])
    const [latestSolutions, setLatestSolutions] = useState([])
    const [solutionsOverTime, setSolutionsOverTime] = useState([]);


    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await dashboardStats()
                console.log(res.data)
                setTotalProblems(res.data.totalProblems)
                setTotalSolutions(res.data.totalSolutionsProvided)
                setTotalSolutionsRecieved(res.data.totalSolutionsRecieved)
                setProblemsStatus(res.data.problemStatus)
                setSolutionsOverTime(res.data.solutionsReceivedOverTime)
                setLatestProblems(res.data.latestProblems)
                setLatestSolutions(res.data.latestSolutions)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false);
            }
        }
        fetchStats()
    }, [])

    // -----------CHARTS----------------

    const ALL_STATUSES = ["open", "solved", "closed"];

    const chartData = ALL_STATUSES.map(status => {
        const found = problemsStatus.find(item => item._id === status);

        return {
            label: status,
            value: found?.count ?? 0,
        };
    });

    const weeklyLineData = solutionsOverTime.map(item => ({
        label: `Week ${item._id.week}`,
        value: item.count,
    }));


    // Loading State
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="relative w-20 h-20">
                    {/* Spinner */}
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-lg font-semibold text-gray-600">Loading dashboard...</p>
            </div>
        );
    }

    const getFakeData = (finalValue) => [
        { value: Math.max(0, finalValue - 15) },
        { value: Math.max(0, finalValue - 10) },
        { value: Math.max(0, finalValue - 8) },
        { value: Math.max(0, finalValue - 5) },
        { value: Math.max(0, finalValue - 2) },
        { value: finalValue },
    ];

    const problemsChartData = solutionsOverTime.length >= 3
        ? solutionsOverTime.map(item => ({ value: item.count }))
        : getFakeData(totalProblems);

    const solutionsProvidedChartData = solutionsOverTime.length >= 3
        ? solutionsOverTime.map(item => ({ value: item.count }))
        : getFakeData(totalSolutions);

    const solutionsReceivedChartData = solutionsOverTime.length >= 3
        ? solutionsOverTime.map(item => ({ value: item.count }))
        : getFakeData(totalSolutionsRecieved);

    return (
        <div className='flex flex-col gap-5'>
            <div className='p-1 flex flex-col gap-2'>
                <h1 className='text-2xl font-bold'>OVERVIEW</h1>
                <p className='text-stone-600'>This is the overview section of your dashboard.</p>
            </div>

            <div className="flex flex-col lg:flex-row w-full justify-center items-stretch gap-4 p-3">
                <div className='bg-white rounded-xl lg:w-1/3 h-32 py-3 px-4 flex justify-center items-center border-2 border-gray-300'>
                    <div className='w-1/2 h-full flex flex-col justify-between'>
                        <h3 className='font-bold text-sm text-[#848484]'>Total Problems</h3>
                        <p className='text-4xl font-bold py-2 pl-2'>{totalProblems || 0}</p>
                        <p className='text-sm font-bold text-[#848484]'>Past 30 Days</p>
                    </div>

                    <div className='w-1/2 h-full'>
                        <MiniLineChart
                            data={problemsChartData}
                            stroke="#3b82f6"
                        />
                    </div>
                </div>


                <div className='bg-white rounded-xl lg:w-1/3 h-32 py-3 px-4 flex justify-center items-center border-2 border-gray-300'>
                    <div className='w-1/2 h-full flex flex-col justify-between'>
                        <h3 className='font-bold text-sm text-[#848484]'>Solutions Provided</h3>
                        <p className='text-4xl font-bold py-2 pl-2'>{totalSolutions || 0}</p>
                        <p className='text-sm font-bold text-[#848484]'>Past 30 Days</p>
                    </div>

                    <div className='w-1/2 h-full'>
                        <MiniLineChart
                            data={solutionsProvidedChartData}
                            stroke="#10b981"
                        />
                    </div>
                </div>


                <div className='bg-white rounded-xl lg:w-1/3 h-32 py-3 px-4 flex justify-center items-center border-2 border-gray-300'>
                    <div className='w-1/2 h-full flex flex-col justify-between'>
                        <h3 className='font-bold text-sm text-[#848484]'>Solutions Recieved</h3>
                        <p className='text-4xl font-bold py-2 pl-2'>{totalSolutionsRecieved || 0}</p>
                        <p className='text-sm font-bold text-[#848484]'>Past 30 Days</p>
                    </div>

                    <div className='w-1/2 h-full'>
                        <MiniLineChart
                            data={solutionsReceivedChartData}
                            stroke="#f59e0b"
                        />
                    </div>
                </div>
            </div>


            {/* CHART AREA */}
            <div className='flex flex-col px-3 gap-3'>
                <h1 className='text-xl font-bold'>Statics</h1>
                <div className='flex gap-4 flex-col lg:flex lg:flex-row'>
                    <div className="lg:w-1/4 h-[300px] bg-white border-2 border-gray-300 rounded-2xl p-4 flex flex-col">
                        <h2 className="text-sm font-semibold text-gray-700">
                            Problem Status
                        </h2>

                        <div className="mt-2">
                            <ReusablePieChart
                                data={chartData}
                                colors={{
                                    open: "#f59e0b",
                                    solved: "#10b981",
                                    closed: "#ef4444",
                                }}
                            />
                        </div>
                    </div>




                    <div className="flex flex-col lg:w-3/4 h-[300px] bg-white border-2 border-gray-300 rounded-2xl p-4">
                        <h2 className="text-sm font-semibold text-gray-700">
                            Solution History
                        </h2>

                        <div className="flex-1 mt-8">
                            <ReusableLineChart
                                data={weeklyLineData}
                                stroke="#10b981"
                            />
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
                                {latestProblems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-3 p-3 items-center border-t-2 border-gray-200"
                                    >
                                        {/* Serial Number */}


                                        {/* Content */}
                                        <div className="flex flex-col gap-1 lg:gap-2">
                                            <div className='flex items-center h-7 gap-3'>
                                                <p className="text-sm font-bold text-gray-500">
                                                    {index + 1}.
                                                </p>
                                                <h3 className="text-md font-semibold text-gray-800">
                                                    {item.title}
                                                </h3>
                                            </div>

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
                                {latestSolutions.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex  gap-3 p-3 items-center border-t-2 border-gray-200"
                                    >

                                        {/* Content */}
                                        <div className="flex flex-col gap-1 lg:gap-2">
                                            <div className='flex items-center h-7 gap-3'>
                                                <p className="text-sm font-bold text-gray-500">
                                                    {index + 1}.
                                                </p>
                                                <h3 className="text-md font-semibold text-gray-800">
                                                    {item.problemId.title}
                                                </h3>
                                            </div>

                                            <h4 className="text-sm text-gray-800">
                                                {item.answer}
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