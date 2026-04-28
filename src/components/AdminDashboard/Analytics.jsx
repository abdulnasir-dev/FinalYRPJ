import React, { useEffect, useState } from "react";
import { getAllUsers, getAnalyticsData } from "../../api/admin.users";
import ReusableLineChart from "../charts/ReusableLineChart";
import ReusablePieChart from "../charts/ReusablePieChart";
import MiniLineChart from "../charts/MiniLineChart";
import { LoaderOne } from "../ui/loader";

const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);
    const [admins, setAdmins] = useState(0);
    const [experts, setExperts] = useState(0);
    const [usersOverTime, setUsersOverTime] = useState([]);

    // Analytics chart data
    const [roleDistribution, setRoleDistribution] = useState([]);
    const [problemStatus, setProblemStatus] = useState([]);
    const [problemsOverTime, setProblemsOverTime] = useState([]);
    const [solutionsOverTime, setSolutionsOverTime] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [usersRes, analyticsRes] = await Promise.all([
                    getAllUsers(),
                    getAnalyticsData()
                ]);

                // Users data
                setTotalUsers(usersRes.data.count);
                setAdmins(usersRes.data.admins);
                setExperts(usersRes.data.experts);
                setUsersOverTime(usersRes.data.usersGraph);

                // Analytics data
                setRoleDistribution(analyticsRes.data.roleDistribution);
                setProblemStatus(analyticsRes.data.problemStatusBreakdown);
                setProblemsOverTime(analyticsRes.data.problemsOverTime);
                setSolutionsOverTime(analyticsRes.data.solutionsOverTime);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <LoaderOne />
            </div>
        );
    }

    const usersLineData = usersOverTime.map(item => ({
        label: item._id,
        value: item.count,
    }));

    const getFakeData = (finalValue) => [
        { value: Math.max(1, Math.floor(finalValue * 0.4)) },
        { value: Math.floor(finalValue * 0.6) },
        { value: Math.floor(finalValue * 0.8) },
        { value: finalValue },
    ];

    // Role distribution pie data
    const roleLabels = { user: "Users", expert: "Experts", admin: "Admins" };
    const roleColors = { Users: "#3b82f6", Experts: "#f59e0b", Admins: "#10b981" };
    const rolePieData = roleDistribution.map(item => ({
        label: roleLabels[item._id] || item._id,
        value: item.count,
    }));

    // Problem status pie data
    const statusLabels = { open: "Open", solved: "Solved", closed: "Closed" };
    const statusColors = { Open: "#3b82f6", Solved: "#10b981", Closed: "#ef4444" };
    const statusPieData = problemStatus.map(item => ({
        label: statusLabels[item._id] || item._id,
        value: item.count,
    }));

    // Problems over time line data
    const problemsLineData = problemsOverTime.map(item => ({
        label: item._id,
        value: item.count,
    }));

    // Solutions over time line data
    const solutionsLineData = solutionsOverTime.map(item => ({
        label: item._id,
        value: item.count,
    }));

    return (
        <div className="flex flex-col gap-5">

            {/* HEADER */}
            <div className="p-1 flex flex-col gap-2">
                <h1 className="text-2xl font-bold">USERS OVERVIEW</h1>
                <p className="text-stone-600">
                    This section shows platform-wide user statistics.
                </p>
            </div>

            {/* STATS CARDS */}
            <div className="flex flex-col lg:flex-row w-full justify-center items-stretch gap-4 lg:p-3">
                <div className="bg-white rounded-xl lg:w-1/3 h-32 py-3 px-4 flex border-2 border-gray-300">
                    <div className="w-1/2 flex flex-col justify-between">
                        <h3 className="font-bold text-sm text-[#848484]">Total Users</h3>
                        <p className="text-4xl font-bold py-2 pl-2">{totalUsers}</p>
                        <p className="text-sm font-bold text-[#848484]">Platform Wide</p>
                    </div>

                    <div className="w-1/2">
                        <MiniLineChart
                            data={getFakeData(totalUsers)}
                            stroke="#3b82f6"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl lg:w-1/3 h-32 py-3 px-4 flex border-2 border-gray-300">
                    <div className="w-1/2 flex flex-col justify-between">
                        <h3 className="font-bold text-sm text-[#848484]">Admins</h3>
                        <p className="text-4xl font-bold py-2 pl-2">{admins}</p>
                        <p className="text-sm font-bold text-[#848484]">Administrators</p>
                    </div>

                    <div className="w-1/2">
                        <MiniLineChart
                            data={getFakeData(admins)}
                            stroke="#10b981"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl lg:w-1/3 h-32 py-3 px-4 flex border-2 border-gray-300">
                    <div className="w-1/2 flex flex-col justify-between">
                        <h3 className="font-bold text-sm text-[#848484]">Experts</h3>
                        <p className="text-4xl font-bold py-2 pl-2">{experts}</p>
                        <p className="text-sm font-bold text-[#848484]">Verified Experts</p>
                    </div>

                    <div className="w-1/2">
                        <MiniLineChart
                            data={getFakeData(experts)}
                            stroke="#f59e0b"
                        />
                    </div>
                </div>
            </div>

            {/* USER GROWTH CHART */}
            <div className="flex flex-col lg:px-3 gap-3">
                <h1 className="text-xl font-bold">Statistics</h1>

                <div className="bg-white border-2 border-gray-300 rounded-2xl p-4 h-[320px]">
                    <h2 className="text-sm font-semibold text-gray-700">
                        User Growth Over Time
                    </h2>

                    <div className="mt-8 h-full">
                        <ReusableLineChart
                            data={usersLineData}
                            stroke="#3b82f6"
                        />
                    </div>
                </div>
            </div>

            {/* PIE CHARTS ROW */}
            <div className="flex flex-col lg:flex-row w-full gap-4 lg:px-3">
                <div className="bg-white border-2 border-gray-300 rounded-2xl p-4 lg:w-1/2">
                    <h2 className="text-sm font-semibold text-gray-700 mb-2">
                        User Role Distribution
                    </h2>
                    <ReusablePieChart
                        data={rolePieData}
                        colors={roleColors}
                    />
                </div>

                <div className="bg-white border-2 border-gray-300 rounded-2xl p-4 lg:w-1/2">
                    <h2 className="text-sm font-semibold text-gray-700 mb-2">
                        Problem Status Breakdown
                    </h2>
                    <ReusablePieChart
                        data={statusPieData}
                        colors={statusColors}
                    />
                </div>
            </div>

            {/* PROBLEMS & SOLUTIONS OVER TIME */}
            <div className="flex flex-col lg:flex-row w-full gap-4 lg:px-3 pb-4">
                <div className="bg-white border-2 border-gray-300 rounded-2xl p-4 h-[320px] lg:w-1/2">
                    <h2 className="text-sm font-semibold text-gray-700">
                        Problems Created Over Time
                    </h2>
                    <div className="mt-8 h-full">
                        <ReusableLineChart
                            data={problemsLineData}
                            stroke="#f59e0b"
                        />
                    </div>
                </div>

                <div className="bg-white border-2 border-gray-300 rounded-2xl p-4 h-[320px] lg:w-1/2">
                    <h2 className="text-sm font-semibold text-gray-700">
                        Solutions Submitted Over Time
                    </h2>
                    <div className="mt-8 h-full">
                        <ReusableLineChart
                            data={solutionsLineData}
                            stroke="#10b981"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
