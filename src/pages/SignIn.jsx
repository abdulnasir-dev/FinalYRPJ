import React, { useState, useRef } from "react";
import { LoginUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SignIn = ({ switchtoSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email and password required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await toast.promise(
        LoginUser({ email, password }),
        {
          loading: "Signing in...",
          success: "Welcome back 👋",
          error: "Invalid email or password",
        }
      );
      // console.log(res.data)
      localStorage.setItem("role", res.data.role)
      localStorage.setItem("accessToken", res.data.accessToken);

      window.location.href = "/dashboard";

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      passwordRef.current?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-zinc-800 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-center mb-2 text-white">
          Welcome Back
        </h1>

        <p className="text-gray-300 mb-6 text-center">
          Sign in to continue
        </p>

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleEmailKeyDown}
          autoComplete="email"
          className="w-full mb-4 px-4 py-4 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
        />

        <input
          ref={passwordRef}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full mb-4 px-4 py-4 rounded-lg bg-white/10 text-white placeholder-gray-400 outline-none border border-white/20 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don&apos;t have an account?
        </p>

        <span
          onClick={()=> navigate("/signup")}
          className="text-blue-400 hover:underline cursor-pointer flex justify-center"
        >
          Sign up
        </span>
      </form>
    </div>
  );
};

export default SignIn;