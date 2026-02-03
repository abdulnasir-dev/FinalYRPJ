import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../api/admin.users";
import ReusableLineChart from "../charts/ReusableLineChart";
import MiniLineChart from "../charts/MiniLineChart";
import { LoaderOne } from "../ui/loader";

const Users = () => {
    const [loading, setLoading] = useState(true);
    const [totalUsers, setTotalUsers] = useState(0);
    const [proUsers, setProUsers] = useState(0);
    const [usersOverTime, setUsersOverTime] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await getAllUsers();
                setTotalUsers(res.data.count);
                setProUsers(res.data.proUsers);
                setUsersOverTime(res.data.usersGraph);
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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-lg font-semibold text-gray-600">
                    Loading admin dashboard...
                </p>
            </div>
        );
    }

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
                        <h3 className="font-bold text-sm text-[#848484]">Pro Users</h3>
                        <p className="text-4xl font-bold py-2 pl-2">{proUsers}</p>
                        <p className="text-sm font-bold text-[#848484]">Subscribed</p>
                    </div>

                    <div className="w-1/2">
                        <MiniLineChart
                            data={getFakeData(proUsers)}
                            stroke="#10b981"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl lg:w-1/3 h-32 py-3 px-4 flex border-2 border-gray-300">
                    <div className="w-1/2 flex flex-col justify-between">
                        <h3 className="font-bold text-sm text-[#848484]">Free Users</h3>
                        <p className="text-4xl font-bold py-2 pl-2">
                            {totalUsers - proUsers}
                        </p>
                        <p className="text-sm font-bold text-[#848484]">Non-paid</p>
                    </div>

                    <div className="w-1/2">
                        <MiniLineChart
                            data={getFakeData(totalUsers - proUsers)}
                            stroke="#f59e0b"
                        />
                    </div>
                </div>
            </div>

            {/* CHART */}
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
        </div>
    );
};

export default Users;
