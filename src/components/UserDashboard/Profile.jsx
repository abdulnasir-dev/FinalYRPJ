import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { profilePage } from "../../api/userDashboard";
import { LoaderOne } from "../ui/loader";

const Profile = () => {
    const { userId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await profilePage(userId);
                setData(res.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    // Format "Member since"
    const formatMemberSince = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <LoaderOne />
            </div>
        );
    }

    if (!data) {
        return (
            <p className="text-center text-gray-500">
                Failed to load profile.
            </p>
        );
    }

    // Safe profile extraction
    const user = data.publicProfile || data.privateProfile;
    const userStats = data.publicProfile?.userStats;

    if (!user) {
        return (
            <p className="text-center text-gray-500">
                Profile data unavailable.
            </p>
        );
    }

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Header */}
            <div className="p-1 flex flex-col gap-2">
                <h1 className="text-2xl font-bold">PROFILE</h1>
                <p className="text-stone-600">
                    View user details and activity summary.
                </p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl w-full py-6 px-5 border-2 border-gray-300 flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full overflow-hidden bg-black text-white flex items-center justify-center text-3xl font-bold">
                    {user.coverImage ? (
                        <img
                            src={user.coverImage}
                            alt={user.fullName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        user.fullName?.charAt(0)
                    )}
                </div>


                {/* Info */}
                <div className="flex flex-col gap-1 text-center md:text-left">
                    <h2 className="text-xl font-bold">{user.fullName}</h2>
                    <p className="text-gray-600">{user.email}</p>

                    {/* Member since */}
                    {user.createdAt && (
                        <p
                            className="text-sm text-gray-500"
                            title={new Date(user.createdAt).toLocaleDateString()}
                        >
                            Member since{" "}
                            <span className="font-semibold text-gray-700">
                                {formatMemberSince(user.createdAt)}
                            </span>
                        </p>
                    )}

                    {user.bio && (
                        <div className="mt-4 w-full md:max-w-2xl">
                            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                                About
                            </p>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {user.bio}
                                </p>
                            </div>
                        </div>
                    )}


                    <div className="flex gap-2 mt-2 justify-center md:justify-start">
                        <span className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded-full">
                            {user.role}
                        </span>

                        {user.isExpertVerified && (
                            <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">
                                Verified
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border-2 border-gray-300">
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="text-lg font-bold">
                        {user.experience || 0} years
                    </p>
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-gray-300">
                    <p className="text-sm text-gray-500">Portfolio</p>
                    {user.portfolioLink ? (
                        <a
                            href={user.portfolioLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 underline font-semibold"
                        >
                            View Portfolio
                        </a>
                    ) : (
                        <p className="text-gray-400">Not provided</p>
                    )}
                </div>

                <div className="bg-white rounded-xl p-4 border-2 border-gray-300 md:col-span-2">
                    <p className="text-sm text-gray-500 mb-2">
                        Expert Categories
                    </p>

                    {user.expertCategories?.length ? (
                        <div className="flex flex-wrap gap-2">
                            {user.expertCategories.map((cat, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-full"
                                >
                                    {cat}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400">No categories listed</p>
                    )}
                </div>
            </div>

            {/* Stats Cards (only public) */}
            {userStats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-black text-white rounded-xl px-6 py-4">
                        <p className="text-sm opacity-70">Total Points</p>
                        <p className="text-2xl font-bold">
                            {userStats.totalPoints}
                        </p>
                    </div>

                    <div className="bg-gray-200 text-gray-900 rounded-xl px-6 py-4">
                        <p className="text-sm opacity-70">Problems Posted</p>
                        <p className="text-2xl font-bold">
                            {userStats.totalProblemsPosted}
                        </p>
                    </div>

                    <div className="bg-gray-200 text-gray-900 rounded-xl px-6 py-4">
                        <p className="text-sm opacity-70">Solutions</p>
                        <p className="text-2xl font-bold">
                            {userStats.totalSolutions}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
