import React, { useEffect, useState } from 'react'
import { dashboardStats } from '../../api/userDashboard';
import ReusablePieChart from '../charts/ReusablePieChart';
import ReusableLineChart from '../charts/ReusableLineChart';
import MiniLineChart from '../charts/MiniLineChart';
import { LoaderFive, LoaderFour, LoaderOne, LoaderThree, LoaderTwo } from '../ui/loader';

const Overview = () => {

    const [loading, setLoading] = useState(true);
    const [totalProblems, setTotalProblems] = useState(0)
    const [totalSolutions, setTotalSolutions] = useState(0)
    const [totalSolutionsRecieved, setTotalSolutionsRecieved] = useState(0)

    const [problemsStatus, setProblemsStatus] = useState([])
    const [latestProblems, setLatestProblems] = useState([])
    const [latestSolutions, setLatestSolutions] = useState([])
    const [solutionsOverTime, setSolutionsOverTime] = useState([]);
    const [totalPoints, setTotalPoints] = useState("")

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await dashboardStats()
                // console.log(res.data)
                setTotalProblems(res.data.totalProblems)
                setTotalSolutions(res.data.totalSolutionsProvided)
                setTotalSolutionsRecieved(res.data.totalSolutionsRecieved)
                setProblemsStatus(res.data.problemStatus)
                setSolutionsOverTime(res.data.solutionsReceivedOverTime)
                setLatestProblems(res.data.latestProblems)
                setLatestSolutions(res.data.latestSolutions)
                setTotalPoints(res.data.totalPoints)
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

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <LoaderOne />
            </div>
        );
    }



    // Replace your getFakeData function with this:
    const getFakeData = (finalValue) => {
        const baseValue = Math.max(1, Math.floor(finalValue * 0.4)); // Start at 40% of final
        return [
            { value: baseValue },
            { value: Math.floor(finalValue * 0.55) },
            { value: Math.floor(finalValue * 0.65) },
            { value: Math.floor(finalValue * 0.78) },
            { value: Math.floor(finalValue * 0.90) },
            { value: finalValue },
        ];
    };

    const problemsChartData = solutionsOverTime.length >= 3
        ? solutionsOverTime.map(item => ({ value: item.count }))
        : getFakeData(totalProblems);

    const solutionsProvidedChartData = solutionsOverTime.length >= 3
        ? solutionsOverTime.map(item => ({ value: item.count }))
        : getFakeData(totalSolutions);

    const solutionsReceivedChartData = solutionsOverTime.length >= 3
        ? solutionsOverTime.map(item => ({ value: item.count }))
        : getFakeData(totalSolutionsRecieved);

    const totalPointsChartData = solutionsOverTime.length >= 3
        ? solutionsOverTime.map(item => ({ value: item.count }))
        : getFakeData(totalPoints);

return (
  <div className="flex flex-col gap-8 bg-gradient-to-br from-gray-50 to-gray-100 p-4">

    {/* HEADER */}
    <div className="bg-white/70 backdrop-blur-md border border-gray-100 rounded-2xl shadow-sm px-6 py-6">
      <h1 className="text-3xl font-semibold bg-gradient-to-br from-emerald-900 to-teal-400 bg-clip-text text-transparent tracking-tight">
        Overview
      </h1>
      <p className="text-gray-500 text-sm mt-1">
        Track your activity and performance insights.
      </p>
    </div>

    {/* STAT CARDS */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* CARD 1 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-gray-500">Total Problems</h3>
          <p className="text-3xl font-bold text-gray-900">
            {totalProblems || 0}
          </p>
          <span className="text-xs text-gray-400">Past 30 Days</span>
        </div>

        <div className="w-32 h-20">
          <MiniLineChart data={problemsChartData} stroke="#3b82f6" />
        </div>
      </div>

      {/* CARD 2 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-gray-500">Solutions Provided</h3>
          <p className="text-3xl font-bold text-gray-900">
            {totalSolutions || 0}
          </p>
          <span className="text-xs text-gray-400">Past 30 Days</span>
        </div>

        <div className="w-32 h-20">
          <MiniLineChart data={solutionsProvidedChartData} stroke="#10b981" />
        </div>
      </div>

      {/* CARD 3 */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm text-gray-500">Total Points</h3>
          <p className="text-3xl font-bold text-gray-900">
            {totalPoints || 0}
          </p>
          <span className="text-xs text-gray-400">Lifetime</span>
        </div>

        <div className="w-32 h-20">
          <MiniLineChart data={totalPointsChartData} stroke="#f59e0b" />
        </div>
      </div>
    </div>

    {/* CHART SECTION */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Problem Status
        </h2>
        <ReusablePieChart
          data={chartData}
          colors={{
            open: "#f59e0b",
            solved: "#10b981",
            closed: "#ef4444",
          }}
        />
      </div>

      <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-6">
          Solution History
        </h2>
        <ReusableLineChart
          data={weeklyLineData}
          stroke="#10b981"
        />
      </div>
    </div>

    {/* RECENT ACTIVITY */}
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">
          Recent Activity
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Your latest posts and contributions
        </p>
      </div>

      <div className="divide-y divide-gray-100">

        {/* Problems */}
        <div className="px-6 py-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Posted Problems
          </h3>

          {latestProblems.length === 0 ? (
            <p className="text-sm text-gray-400">
              No problems posted yet.
            </p>
          ) : (
            latestProblems.map((item, index) => (
              <div key={index} className="mb-4">
                <p className="text-sm font-semibold text-gray-900">
                  {index + 1}. {item.title}
                </p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Solutions */}
        <div className="px-6 py-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Posted Solutions
          </h3>

          {latestSolutions.length === 0 ? (
            <p className="text-sm text-gray-400">
              No solutions posted yet.
            </p>
          ) : (
            latestSolutions.map((item, index) => (
              <div key={index} className="mb-4">
                <p className="text-sm font-semibold text-gray-900">
                  {index + 1}. {item.problemId.title}
                </p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {item.answer}
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>

  </div>
);

}

export default Overview