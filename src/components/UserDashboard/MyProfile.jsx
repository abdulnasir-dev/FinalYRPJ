import React, { useEffect, useState } from "react";
import { LoaderOne } from "../ui/loader";
import { getMyProfile, updateMyProfile } from "@/api/userDashboard";
import Button from "../ui/Button";

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
                console.log(res);
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
  <div className="flex flex-col gap-6 h-full bg-gradient-to-br from-gray-50 to-gray-100 p-4">

    {/* Header */}
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
        My Profile
      </h1>
      <p className="text-gray-500 text-sm mt-1">
        Manage your personal information and activity.
      </p>
    </div>

    {/* Profile Card */}
    <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row gap-8">

      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-600 text-white flex items-center justify-center text-3xl font-bold shadow-md ring-4 ring-white">
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
            className="text-xs text-gray-500"
          />
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-4 flex-1">

        {isEditing ? (
          <input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        ) : (
          <h2 className="text-2xl font-semibold text-gray-900">
            {user.fullName}
          </h2>
        )}

        <p className="text-gray-500 text-sm">{user.email}</p>

        {user.createdAt && (
          <p className="text-sm text-gray-500">
            Member since{" "}
            <span className="font-medium text-gray-700">
              {formatMemberSince(user.createdAt)}
            </span>
          </p>
        )}

        {/* Bio */}
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">
            About
          </p>

          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          ) : (
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                {user.bio || "No bio provided."}
              </p>
            </div>
          )}
        </div>

        {/* Role */}
        <div>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
            {user.role}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setCoverFile(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Save Changes
              </button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} />
          )}
        </div>
      </div>
    </div>

    {/* Info Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      <div className="bg-white/70 backdrop-blur-md rounded-xl p-5 border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-500">Experience</p>

        {isEditing ? (
          <input
            type="number"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm mt-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        ) : (
          <p className="text-xl font-semibold text-gray-900 mt-2">
            {user.experience || 0} years
          </p>
        )}
      </div>

      <div className="bg-white/70 backdrop-blur-md rounded-xl p-5 border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-500">Portfolio</p>

        {isEditing ? (
          <input
            name="portfolioLink"
            value={formData.portfolioLink}
            onChange={handleChange}
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm mt-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        ) : user.portfolioLink ? (
          <a
            href={user.portfolioLink}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-600 font-medium hover:underline mt-2 inline-block"
          >
            View Portfolio
          </a>
        ) : (
          <p className="text-gray-400 mt-2">Not provided</p>
        )}
      </div>
    </div>

    {/* Stats */}
    {userStats && (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5">
          <p className="text-sm text-gray-500">Total Points</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {userStats.totalPoints}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5">
          <p className="text-sm text-gray-500">Problems Posted</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {userStats.totalProblemsPosted}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-5">
          <p className="text-sm text-gray-500">Solutions</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {userStats.totalSolutions}
          </p>
        </div>

      </div>
    )}
  </div>
);

};

export default MyProfile;
