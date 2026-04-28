import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyOTP } from "@/api/auth.api";
import { Leaf, ArrowRight, Mail, RefreshCw } from "lucide-react";

const VerifyOTP = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please sign up again.");
      navigate("/signup");
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((c) => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take last character only
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < paste.length; i++) {
      newOtp[i] = paste[i];
    }
    setOtp(newOtp);
    const nextEmpty = paste.length < 6 ? paste.length : 5;
    inputRefs.current[nextEmpty]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length < 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const res = await toast.promise(
        verifyOTP({ email, otp: otpString }),
        {
          loading: "Verifying OTP...",
          success: "Account verified successfully",
          error: (err) => err?.response?.data?.message || "OTP verification failed",
        }
      );

      const { accessToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userId", res.data.userId);

      navigate("/");
    } catch (error) {
      console.error("OTP verification failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("OTP resent to your email");
    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    setResending(false);
  };

  const otpComplete = otp.every((d) => d !== "");

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
          <div className="inline-flex items-center gap-2 bg-white/10 text-green-100 text-xs font-medium px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/10">
            <Leaf size={12} className="text-green-300" />
            One last step
          </div>
          <h2 className="text-4xl font-bold text-white leading-snug mb-4">
            Verify your<br />
            <span className="text-green-300">email address</span><br />
            to continue
          </h2>
          <p className="text-green-100/80 text-base leading-relaxed max-w-xs">
            We sent a 6-digit code to your inbox. Enter it to activate your account and start making an impact.
          </p>

          {/* Shield icon graphic */}
          <div className="mt-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
              <Mail size={22} className="text-green-300" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Check your inbox</p>
              <p className="text-green-200/70 text-xs">{email}</p>
            </div>
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
            <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-5">
              <Mail size={26} className="text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Verify your email</h1>
            <p className="text-gray-500 text-sm">
              We sent a 6-digit code to{" "}
              <span className="text-gray-700 font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify}>
            {/* OTP Inputs */}
            <div className="flex gap-2.5 mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  id={`otp-digit-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-full aspect-square text-center text-xl font-bold rounded-xl border-2 bg-white outline-none transition-all duration-200
                    ${digit ? "border-green-500 text-green-700 bg-green-50" : "border-gray-200 text-gray-900"}
                    focus:border-green-500 focus:ring-3 focus:ring-green-100 focus:bg-white
                    hover:border-gray-300`}
                  style={{ minWidth: 0 }}
                />
              ))}
            </div>

            {/* Progress indicator */}
            <div className="flex gap-1 mb-6">
              {otp.map((digit, i) => (
                <div
                  key={i}
                  className={`h-0.5 flex-1 rounded-full transition-all duration-300
                    ${digit ? "bg-green-500" : "bg-gray-200"}`}
                />
              ))}
            </div>

            {/* Verify button */}
            <button
              id="verify-otp-submit"
              type="submit"
              disabled={loading || !otpComplete}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  loading || !otpComplete
                    ? "#d1d5db"
                    : "linear-gradient(135deg, #059669 0%, #047857 100%)",
                boxShadow:
                  loading || !otpComplete ? "none" : "0 4px 14px rgba(5,150,105,0.35)",
                color: loading || !otpComplete ? "#6b7280" : "white",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Verifying...
                </span>
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Resend */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <p className="text-sm text-gray-500">Didn&apos;t receive it?</p>
            <button
              id="resend-otp"
              type="button"
              onClick={handleResend}
              disabled={countdown > 0 || resending}
              className={`flex items-center gap-1.5 text-sm font-semibold transition-all duration-200
                ${countdown > 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-green-600 hover:text-green-700 cursor-pointer"
                }`}
            >
              {resending ? (
                <RefreshCw size={13} className="animate-spin" />
              ) : (
                <RefreshCw size={13} />
              )}
              Resend OTP
              {countdown > 0 && (
                <span className="text-gray-400 font-normal">
                  ({countdown}s)
                </span>
              )}
            </button>
          </div>

          {/* Back link */}
          <div className="text-center mt-4">
            <button
              id="back-to-signup"
              onClick={() => navigate("/signup")}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back to Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;