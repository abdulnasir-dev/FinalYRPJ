import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import toast from "react-hot-toast";

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        const payload = {
            fullName: name,
            email,
            password,
            confirmPass: confirmPassword,
        };

        try {
            const res = await toast.promise(
                registerUser(payload),
                {
                    loading: "Creating account...",
                    success: "Account created successfully 🎉",
                    error: (err) =>
                        err?.response?.data?.message || "Registration failed",
                }
            );

            navigate("/signin");
        } catch (err) {
            // error already handled by toast.promise
            console.error("Signup failed:", err);
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-zinc-800 px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md px-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl py-8 shadow-2xl"
            >
                <h1 className="text-3xl text-center mb-2 text-white font-bold">
                    Welcome!
                </h1>
                <p className="text-gray-300 mb-6 text-center">
                    Sign up to continue
                </p>

                <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
                />

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
                />

                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
                />

                <input
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full mb-4 px-4 py-3 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
                />

                <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:opacity-90 transition"
                >
                    Sign Up
                </button>

                <p className="text-sm text-gray-300 text-center mt-6">
                    Already have an account?
                </p>
                <span
                    onClick={() => navigate("/signin")}
                    className="text-blue-400 hover:underline flex justify-center text-sm cursor-pointer"
                >
                    Sign In
                </span>
            </form>
        </div>
    );
};

export default SignUp;
