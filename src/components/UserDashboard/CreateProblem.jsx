import React, { useState } from "react";
import { createProblem } from "../../api/problems.api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
    "water conservation",
    "food waste",
    "energy efficiency",
    "waste management",
    "sustainable agriculture",
    "air pollution",
    "plastic reduction",
    "urban sustainability",
    "climate awareness",
    "eco-friendly living",
];

const CreateProblem = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [banner, setBanner] = useState(null);
    const [expertOnly, setExpertOnly] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    /* ---------------- TAGS ---------------- */

    const addTag = () => {
        if (!tagInput.trim()) return;
        if (tags.includes(tagInput.trim().toLowerCase())) return;

        setTags((prev) => [...prev, tagInput.trim().toLowerCase()]);
        setTagInput("");
    };

    const removeTag = (tag) => {
        setTags((prev) => prev.filter((t) => t !== tag));
    };

    /* ---------------- SUBMIT ---------------- */

    const handleSubmit = async () => {
        if (!title || !description) {
            return alert("Title & description required");
        }

        try {
            setLoading(true);

            const submitProblem = async () => {
                const formData = new FormData();
                formData.append("title", title);
                formData.append("description", description);
                formData.append("category", category); // Optional - backend will generate if empty
                formData.append("expertOnly", expertOnly);
                formData.append("tags", JSON.stringify(tags));
                if (banner) formData.append("bannerImage", banner);

                await createProblem(formData);
            }

            toast.promise(
                submitProblem(),
                {
                    loading: "Creating problem...",
                    success: "Problem created successfully",
                    error: (err) =>
                        err?.response?.data?.message || "Failed to create problem",
                }
            ).then(() => {
                // Reset form
                setTitle("");
                setDescription("");
                setCategory("");
                setTags([]);
                setBanner(null);
                setExpertOnly(false);

                navigate("/")
            })
        } catch (e) {
            alert(e.response?.data?.message || "Failed to create problem");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold">CREATE PROBLEM</h1>
                <p className="text-gray-600">
                    Describe a sustainability issue clearly to get better solutions.
                </p>
            </div>

            {/* FORM */}
            <div className="bg-white border-2 border-gray-300 rounded-xl p-5 flex flex-col gap-5">
                {/* TITLE */}
                <div>
                    <label className="font-semibold text-sm">Title</label>
                    <textarea
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded-lg p-3 mt-1"
                        rows={2}
                        placeholder="Enter a clear problem title"
                    />
                </div>

                {/* DESCRIPTION */}
                <div>
                    <label className="font-semibold text-sm">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded-lg p-3 mt-1"
                        rows={6}
                        placeholder="Describe the problem in detail"
                    />
                </div>

                {/* CATEGORY */}
                <div>
                    <label className="font-semibold text-sm">
                        Category <span className="text-gray-500 text-xs">(Optional - AI will auto-detect if not selected)</span>
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm mt-2"
                    >
                        <option value="">AI will auto-detect category</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* TAGS */}
                <div>
                    <label className="font-semibold text-sm">Tags (Optional)</label>

                    <div className="flex gap-2 mt-2">
                        <input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && addTag()}
                            className="flex-1 border rounded-lg px-3 py-2 text-sm"
                            placeholder="Add custom tag (no spaces)"
                        />
                        <button
                            onClick={addTag}
                            className="px-3 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-900"
                        >
                            Add
                        </button>
                    </div>

                    {tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-3">
                            {tags.map((tag) => (
                                <span
                                    key={tag}
                                    onClick={() => removeTag(tag)}
                                    className="px-3 py-1 bg-gray-100 rounded-full text-xs cursor-pointer hover:bg-gray-200"
                                >
                                    #{tag} ✕
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* IMAGE */}
                <div>
                    <label className="font-semibold text-sm">Banner Image (Optional)</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setBanner(e.target.files[0])}
                        className="mt-2 text-sm"
                    />
                </div>

                {/* EXPERT ONLY */}
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                        type="checkbox"
                        checked={expertOnly}
                        onChange={() => setExpertOnly((p) => !p)}
                    />
                    Expert-only problem
                </label>

                {/* SUBMIT */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700"
                >
                    {loading ? "Creating Problem..." : "Create Problem"}
                </button>
            </div>
        </div>
    );
};

export default CreateProblem;