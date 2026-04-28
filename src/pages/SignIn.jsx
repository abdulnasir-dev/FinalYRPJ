import React, { useState, useRef } from "react";
import { LoginUser } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Leaf, ArrowRight, Mail, Lock } from "lucide-react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
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

      const res = await toast.promise(
        LoginUser({ email, password }),
        {
          loading: "Signing in...",
          success: "Welcome back 👋",
          error: "Invalid email or password",
        }
      );

      localStorage.setItem("role", res.data.role);
      localStorage.setItem("accessToken", res.data.accessToken);

      if (res.data.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
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
    <div className="min-h-screen flex bg-gray-50">
      {/* ── LEFT BRAND PANEL ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 70%, #059669 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full"
          style={{ background: "rgba(255,255,255,0.06)" }} />
        <div className="absolute bottom-[-100px] left-[-60px] w-96 h-96 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)" }} />
        <div className="absolute top-1/2 left-[-40px] w-48 h-48 rounded-full"
          style={{ background: "rgba(255,255,255,0.04)" }} />

        {/* Logo */}
        <div className="relative z-10 p-10 flex items-center gap-3">
          <img src="/favicon.png" alt="ImpactHub" className="w-10 h-10 rounded-xl object-contain" />
          <span className="text-white text-xl font-bold tracking-tight">ImpactHub</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 px-10 pb-16">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 bg-white/10 text-green-100 text-xs font-medium px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/10">
              <Leaf size={12} className="text-green-300" />
              Building a sustainable future
            </div>
            <h2 className="text-4xl font-bold text-white leading-snug mb-4">
              Solve real-world<br />
              <span className="text-green-300">environmental</span><br />
              challenges
            </h2>
            <p className="text-green-100/80 text-base leading-relaxed max-w-xs">
              Join a community of innovators tackling climate, water, energy, and sustainability problems — together.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { value: "2k+", label: "Innovators" },
              { value: "500+", label: "Problems Solved" },
              { value: "50+", label: "Categories" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-3 text-center">
                <div className="text-white font-bold text-lg">{stat.value}</div>
                <div className="text-green-200/70 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <img src="/favicon.png" alt="ImpactHub" className="w-9 h-9 rounded-xl object-contain" />
          <span className="text-gray-900 text-xl font-bold">ImpactHub</span>
        </div>

        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
            <p className="text-gray-500 text-sm">Sign in to your ImpactHub account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <div className={`relative flex items-center rounded-xl border transition-all duration-200 bg-white
                ${focusedField === "email"
                  ? "border-green-500 ring-3 ring-green-100 shadow-sm"
                  : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Mail
                  size={16}
                  className={`absolute left-3.5 transition-colors duration-200
                    ${focusedField === "email" ? "text-green-500" : "text-gray-400"}`}
                />
                <input
                  type="email"
                  id="signin-email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleEmailKeyDown}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-400 text-sm rounded-xl outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className={`relative flex items-center rounded-xl border transition-all duration-200 bg-white
                ${focusedField === "password"
                  ? "border-green-500 ring-3 ring-green-100 shadow-sm"
                  : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Lock
                  size={16}
                  className={`absolute left-3.5 transition-colors duration-200
                    ${focusedField === "password" ? "text-green-500" : "text-gray-400"}`}
                />
                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  id="signin-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 py-3 bg-transparent text-gray-900 placeholder-gray-400 text-sm rounded-xl outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="signin-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{
                background: loading
                  ? "#6b7280"
                  : "linear-gradient(135deg, #059669 0%, #047857 100%)",
                boxShadow: loading ? "none" : "0 4px 14px rgba(5,150,105,0.35)",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <button
              id="go-to-signup"
              onClick={() => navigate("/signup")}
              className="text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;