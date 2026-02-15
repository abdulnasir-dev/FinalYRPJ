import React, { useEffect, useState } from "react";
import { LoaderOne } from "../ui/loader";
import { getMyProfile, updateMyProfile } from "@/api/userDashboard";

const MyProfile = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [coverFile, setCoverFile] = useState(null);

    const [formData, setFormData] = useState({
        fullName: "",
        bio: "",
        experience: 0,
        portfolioLink: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const res = await getMyProfile();
                console.log( res);
                setData(res.data);
                const profile = res.data.profile;
                setFormData({
                    fullName: profile.fullName || "",
                    bio: profile.bio || "",
                    experience: profile.experience || 0,
                    portfolioLink: profile.portfolioLink || "",
                });
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const formatMemberSince = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const res = await updateMyProfile(formData, coverFile);
            setData({ profile: res.data.profile });
            setIsEditing(false);
            setCoverFile(null);
        } catch (error) {
            console.error("Update failed", error);
        }
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

    const user = data.profile;
    const userStats = user?.userStats;

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
                <h1 className="text-2xl font-bold">MY PROFILE</h1>
                <p className="text-stone-600">
                    Manage your personal information and activity.
                </p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl w-full py-6 px-5 border-2 border-gray-300 flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-black text-white flex items-center justify-center text-3xl font-bold">
                        {coverFile ? (
                            <img
                                src={URL.createObjectURL(coverFile)}
                                alt="preview"
                                className="w-full h-full object-cover"
                            />
                        ) : user.coverImage ? (
                            <img
                                src={user.coverImage}
                                alt={user.fullName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            user.fullName?.charAt(0)
                        )}
                    </div>

                    {isEditing && (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setCoverFile(e.target.files[0])}
                            className="text-xs"
                        />
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-2 text-center md:text-left w-full">
                    {isEditing ? (
                        <input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-3 py-2 text-sm"
                        />
                    ) : (
                        <h2 className="text-xl font-bold">{user.fullName}</h2>
                    )}

                    <p className="text-gray-600">{user.email}</p>

                    {user.createdAt && (
                        <p className="text-sm text-gray-500">
                            Member since{" "}
                            <span className="font-semibold text-gray-700">
                                {formatMemberSince(user.createdAt)}
                            </span>
                        </p>
                    )}

                    {/* Bio */}
                    <div className="mt-2 w-full md:max-w-2xl">
                        <p className="text-xs uppercase tracking-wide text-gray-400 mb-1">
                            About
                        </p>

                        {isEditing ? (
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={3}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                        ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {user.bio || "No bio provided."}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 mt-2 justify-center md:justify-start">
                        <span className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded-full">
                            {user.role}
                        </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setCoverFile(null);
                                    }}
                                    className="px-4 py-2 bg-gray-300 rounded-lg text-sm font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold"
                                >
                                    Save Changes
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Experience */}
                <div className="bg-white rounded-xl p-4 border-2 border-gray-300">
                    <p className="text-sm text-gray-500">Experience</p>

                    {isEditing ? (
                        <input
                            type="number"
                            name="experience"
                            value={formData.experience}
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-3 py-2 text-sm mt-1"
                        />
                    ) : (
                        <p className="text-lg font-bold">
                            {user.experience || 0} years
                        </p>
                    )}
                </div>

                {/* Portfolio */}
                <div className="bg-white rounded-xl p-4 border-2 border-gray-300">
                    <p className="text-sm text-gray-500">Portfolio</p>

                    {isEditing ? (
                        <input
                            name="portfolioLink"
                            value={formData.portfolioLink}
                            onChange={handleChange}
                            className="border border-gray-300 rounded px-3 py-2 text-sm mt-1 w-full"
                        />
                    ) : user.portfolioLink ? (
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
            </div>

            {/* Stats */}
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

export default MyProfile;
