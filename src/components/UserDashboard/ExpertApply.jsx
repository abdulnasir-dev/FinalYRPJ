import React, { useEffect, useState } from "react";
import { LoaderOne } from "../ui/loader";
import { Check, Briefcase, Globe, Info, Award } from "lucide-react";
import { getMyExpertApplication, submitExpertApplication } from "@/api/expert.api";

const CATEGORY_OPTIONS = [
    "water", "energy", "waste", "food", "agriculture",
    "air", "climate", "urban", "pollution", "environment"
];

const ExpertApply = () => {
    const [formData, setFormData] = useState({
        bio: "",
        experience: "",
        expertCategories: [], // Backend expects an array, so we store the single choice in an array
        portfolioLink: "",
    });

    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // PERSISTED: Fetching your application status
    useEffect(() => {
        const fetchApplication = async () => {
            try {
                setLoading(true);
                const res = await getMyExpertApplication();
                setApplication(res.data.application);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchApplication();
    }, []);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // UPDATED: Single Selection Logic
    const handleSingleSelect = (category) => {
        setFormData((prev) => ({
            ...prev,
            expertCategories: [category], // Wraps the single string in an array for API compatibility
        }));
    };

    const handleSubmit = async () => {
        if (!formData.bio || !formData.experience || !formData.expertCategories.length || !formData.portfolioLink) {
            alert("All fields are required");
            return;
        }
        try {
            setSubmitting(true);
            const payload = { ...formData, experience: Number(formData.experience) };
            const res = await submitExpertApplication(payload);
            setApplication(res.data.application);
            alert("Application submitted successfully");
        } catch (error) {
            alert(error.response?.data?.message || "Submission failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="flex h-screen w-full items-center justify-center"><LoaderOne /></div>;

    return (
        <div className="w-full min-h-screen bg-slate-50 p-4 md:p-5">
            {/* FULL WIDTH WRAPPER */}
            <div className="w-full mx-auto flex flex-col gap-4">

                {/* Header */}
                <div className="w-full bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                        Expert <span className="text-emerald-600">Application</span>
                    </h1>
                    <p className="text-slate-500 mt-2">Verified experts receive priority visibility and double impact points.</p>
                </div>

                {!application || application.status === "rejected" ? (
                    <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                        <div className="p-6 md:p-12 space-y-10">

                            {/* Category Selection - Single Choice Grid */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                                    <Award size={14} className="text-emerald-500" /> Primary Expertise Area
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                                    {CATEGORY_OPTIONS.map((cat) => {
                                        const isSelected = formData.expertCategories[0] === cat;
                                        return (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => handleSingleSelect(cat)}
                                                className={`group relative py-4 px-2 rounded-2xl text-sm font-semibold transition-all duration-300 border-2 flex flex-col items-center justify-center gap-2 ${isSelected
                                                        ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100"
                                                        : "bg-slate-50 border-slate-100 text-slate-600 hover:border-emerald-300 hover:bg-white"
                                                    }`}
                                            >
                                                <span className="capitalize">{cat}</span>
                                                {isSelected && <Check size={16} className="animate-in zoom-in" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Bio & Details */}
                            <div className="grid grid-cols-1 gap-8">
                                <div className="space-y-3">
                                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                                        <Info size={14} className="text-emerald-500" /> Professional Summary
                                    </label>
                                    <textarea
                                        name="bio"
                                        placeholder="Briefly describe your background in the selected field..."
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="w-full min-h-[150px] border-2 border-slate-100 rounded-2xl p-5 text-base focus:border-emerald-500 focus:ring-4 focus:ring-emerald-50/50 transition-all outline-none bg-slate-50/30"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                                            <Briefcase size={14} className="text-emerald-500" /> Years of Experience
                                        </label>
                                        <input
                                            type="number"
                                            name="experience"
                                            placeholder="Ex: 8"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            className="w-full border-2 border-slate-100 rounded-2xl p-5 text-base focus:border-emerald-500 transition-all outline-none bg-slate-50/30"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
                                            <Globe size={14} className="text-emerald-500" /> Portfolio / LinkedIn
                                        </label>
                                        <input
                                            type="text"
                                            name="portfolioLink"
                                            placeholder="https://linkedin.com/in/..."
                                            value={formData.portfolioLink}
                                            onChange={handleChange}
                                            className="w-full border-2 border-slate-100 rounded-2xl p-5 text-base focus:border-emerald-500 transition-all outline-none bg-slate-50/30"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-emerald-600 shadow-2xl shadow-slate-200 transition-all duration-300 transform active:scale-[0.99] disabled:opacity-50"
                            >
                                {submitting ? "SUBMITTING..." : "COMPLETE APPLICATION"}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Persistent Application Status View */
                    <div className="w-full bg-white rounded-3xl p-12 border border-slate-200 text-center flex flex-col items-center gap-6">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${application.status === 'approved' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                            {application.status === 'approved' ? <Check size={40} /> : <Info size={40} />}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 capitalize">Application {application.status}</h2>
                            <p className="text-slate-500 mt-2 max-w-md mx-auto">
                                {application.status === "pending"
                                    ? "Our team is currently reviewing your expertise credentials. You'll receive a notification once verified."
                                    : "You are a verified expert! You can now manage your specialized content."}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpertApply;