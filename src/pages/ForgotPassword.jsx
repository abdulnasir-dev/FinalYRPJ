import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "@/api/auth.api";
import { Mail, ArrowRight, Leaf, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      await toast.promise(
        forgotPassword({ email: email.trim() }),
        {
          loading: "Sending OTP...",
          success: "OTP sent! Check your inbox.",
          error: (err) => err?.response?.data?.message || "Failed to send OTP",
        }
      );
      // Always navigate on success (backend doesn't reveal if email exists)
      navigate("/reset-password", { state: { email: email.trim() } });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ── LEFT BRAND PANEL ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 70%, #059669 100%)",
        }}
      >
        <div
          className="absolute top-[-80px] right-[-80px] w-72 h-72 rounded-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />
        <div
          className="absolute bottom-[-100px] left-[-60px] w-96 h-96 rounded-full"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <div
          className="absolute top-1/2 left-[-40px] w-48 h-48 rounded-full"
          style={{ background: "rgba(255,255,255,0.04)" }}
        />

        {/* Logo */}
        <div className="relative z-10 p-10 flex items-center gap-3">
          <img
            src="/favicon.png"
            alt="ImpactHub"
            className="w-10 h-10 rounded-xl object-contain"
          />
          <span className="text-white text-xl font-bold tracking-tight">
            ImpactHub
          </span>
        </div>

        {/* Center */}
        <div className="relative z-10 px-10 pb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 text-green-100 text-xs font-medium px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/10">
            <Leaf size={12} className="text-green-300" />
            Account Recovery
          </div>
          <h2 className="text-4xl font-bold text-white leading-snug mb-4">
            Forgot your<br />
            <span className="text-green-300">password?</span><br />
            No worries.
          </h2>
          <p className="text-green-100/80 text-base leading-relaxed max-w-xs">
            Enter your email and we&apos;ll send you a one-time code to reset your
            password and get back into your account.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
              <Mail size={22} className="text-green-300" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                Check your inbox
              </p>
              <p className="text-green-200/70 text-xs">
                OTP valid for 10 minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <img
            src="/favicon.png"
            alt="ImpactHub"
            className="w-9 h-9 rounded-xl object-contain"
          />
          <span className="text-gray-900 text-xl font-bold">ImpactHub</span>
        </div>

        <div className="w-full max-w-sm">
          {/* Back link */}
          <button
            onClick={() => navigate("/signin")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Sign In
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-5">
              <Mail size={26} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Forgot password?
            </h1>
            <p className="text-gray-500 text-sm">
              Enter your email and we&apos;ll send you an OTP to reset your
              password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="forgot-email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email address
              </label>
              <div
                className={`relative flex items-center rounded-xl border transition-all duration-200 bg-white
                  ${
                    focusedField
                      ? "border-green-500 ring-3 ring-green-100 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
              >
                <Mail
                  size={16}
                  className={`absolute left-3.5 transition-colors duration-200 ${
                    focusedField ? "text-green-500" : "text-gray-400"
                  }`}
                />
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField(true)}
                  onBlur={() => setFocusedField(false)}
                  autoComplete="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-400 text-sm rounded-xl outline-none"
                />
              </div>
            </div>

            <button
              id="forgot-password-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{
                background: loading
                  ? "#6b7280"
                  : "linear-gradient(135deg, #059669 0%, #047857 100%)",
                boxShadow: loading
                  ? "none"
                  : "0 4px 14px rgba(5,150,105,0.35)",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Sending OTP...
                </span>
              ) : (
                <>
                  Send Reset OTP
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
