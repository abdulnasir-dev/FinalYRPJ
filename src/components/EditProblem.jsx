import { editProblem, fetchProblemById } from '@/api/problems.api'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams, useNavigate } from 'react-router-dom'
import { LoaderOne } from './ui/loader'

const EditProblem = () => {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState([])
    const [coverImage, setCoverImage] = useState(null)
    const [preview, setPreview] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    const { problemId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const loadProblemData = async () => {
            try {
                const res = await fetchProblemById(problemId)
                const problem = res.data.problem

                setTitle(problem.title || "")
                setDescription(problem.description || "")
                setTags(problem.tags || [])
                setPreview(problem.bannerImage?.url || null)
            } catch (error) {
                toast.error("Failed to load problem")
            } finally {
                setLoading(false)
            }
        }
        loadProblemData()
    }, [problemId])

    const handleTagsArray = (e) => {
        const value = e.target.value
        const tagArray = value
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)

        setTags(tagArray)
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setCoverImage(file)

        if (file) {
            const imageUrl = URL.createObjectURL(file)
            setPreview(imageUrl)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)

        const formData = new FormData()
        if (title.trim()) formData.append("title", title)
        if (description.trim()) formData.append("description", description)
        if (tags.length > 0) formData.append("tags", JSON.stringify(tags))
        if (coverImage) formData.append("bannerImage", coverImage)

        try {
            await toast.promise(
                editProblem(problemId, formData),
                {
                    loading: "Updating problem...",
                    success: "Problem updated successfully! 🎉",
                    error: "Failed to update problem",
                }
            )

            navigate(`/problem/${problemId}`)
        } catch (error) {
            console.error("Update failed:", error)
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <LoaderOne />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 h-full p-4 md:p-6">

            {/* Header */}
            <div className="p-1 flex flex-col gap-2">
                <h1 className="text-2xl font-bold">EDIT PROBLEM</h1>
                <p className="text-stone-600">
                    Update details, fix typos, or change the image.
                </p>
            </div>

            {/* Form container */}
            <div className="bg-white rounded-xl w-full py-4 px-4 flex flex-col gap-5 border-2 border-gray-300">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                    {/* Title */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border-2 border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                            className="border-2 border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            value={tags.join(", ")}
                            onChange={handleTagsArray}
                            className="border-2 border-gray-300 rounded-md px-3 py-2"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">
                            Cover Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {/* Preview container */}
                        <div className="w-full max-h-[220px] bg-gray-100 border-2 border-gray-300 rounded-xl flex items-center justify-center overflow-hidden">
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-sm text-gray-400">
                                    No image selected
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold disabled:opacity-50"
                        >
                            {submitting ? "Updating..." : "Update Problem"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate(`/problem/${problemId}`)}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold"
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default EditProblem
