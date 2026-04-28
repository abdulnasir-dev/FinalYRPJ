import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyResetOTP, resetPassword, forgotPassword } from "@/api/auth.api";
import { Leaf, ArrowRight, ArrowLeft, Lock, Eye, EyeOff, ShieldCheck, RefreshCw } from "lucide-react";

const ResetPassword = () => {
  const [step, setStep] = useState("otp"); // "otp" | "newPassword"
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 min

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      toast.error("Session expired. Please start again.");
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // OTP input handlers
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const next = [...otp];
      next[index - 1] = "";
      setOtp(next);
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    for (let i = 0; i < paste.length; i++) next[i] = paste[i];
    setOtp(next);
    inputRefs.current[Math.min(paste.length, 5)]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpStr = otp.join("");
    if (otpStr.length < 6) {
      toast.error("Enter the complete 6-digit OTP");
      return;
    }
    try {
      setLoading(true);
      const res = await toast.promise(
        verifyResetOTP({ email, otp: otpStr }),
        {
          loading: "Verifying OTP...",
          success: "OTP verified!",
          error: (err) => err?.response?.data?.message || "Invalid OTP",
        }
      );
      setResetToken(res.data.resetToken);
      setStep("newPassword");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    try {
      await toast.promise(
        forgotPassword({ email }),
        {
          loading: "Resending OTP...",
          success: "New OTP sent!",
          error: "Failed to resend OTP",
        }
      );
      setOtp(["", "", "", "", "", ""]);
      setCountdown(600);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error(err);
    } finally {
      setResending(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      await toast.promise(
        resetPassword({ resetToken, newPassword, confirmPassword }),
        {
          loading: "Resetting password...",
          success: "Password reset successfully!",
          error: (err) => err?.response?.data?.message || "Failed to reset password",
        }
      );
      navigate("/signin");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const otpComplete = otp.every((d) => d !== "");

  const passwordStrength = () => {
    return (
      (newPassword.length >= 8 ? 1 : 0) +
      (/[A-Z]/.test(newPassword) ? 1 : 0) +
      (/[0-9]/.test(newPassword) ? 1 : 0) +
      (/[^A-Za-z0-9]/.test(newPassword) ? 1 : 0)
    );
  };

  const strengthColors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ── LEFT BRAND PANEL ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 70%, #059669 100%)",
        }}
      >
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

        {/* Center */}
        <div className="relative z-10 px-10 pb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 text-green-100 text-xs font-medium px-3 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/10">
            <Leaf size={12} className="text-green-300" />
            {step === "otp" ? "Step 1 of 2 – Verify OTP" : "Step 2 of 2 – New Password"}
          </div>
          <h2 className="text-4xl font-bold text-white leading-snug mb-4">
            {step === "otp" ? (
              <>Verify your<br /><span className="text-green-300">identity</span><br />first</>
            ) : (
              <>Create a<br /><span className="text-green-300">new password</span><br />for your account</>
            )}
          </h2>
          <p className="text-green-100/80 text-base leading-relaxed max-w-xs">
            {step === "otp"
              ? `Enter the 6-digit code sent to ${email}. It expires in ${formatTime(countdown)}.`
              : "Choose a strong password. It should be at least 6 characters with a mix of letters, numbers, and symbols."}
          </p>

          {/* Step indicators */}
          <div className="mt-8 flex gap-3">
            {["otp", "newPassword"].map((s, i) => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500
                ${step === s || (i === 0 && step === "newPassword") ? "bg-green-400" : "bg-white/20"}`} />
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
          {/* Back */}
          <button
            onClick={() => step === "newPassword" ? setStep("otp") : navigate("/forgot-password")}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors"
          >
            <ArrowLeft size={15} />
            {step === "newPassword" ? "Back to OTP" : "Back"}
          </button>

          {/* ── STEP 1: OTP ── */}
          {step === "otp" && (
            <>
              <div className="mb-8">
                <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-5">
                  <ShieldCheck size={26} className="text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Enter the OTP</h1>
                <p className="text-gray-500 text-sm">
                  Sent to <span className="text-gray-700 font-medium">{email}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp}>
                {/* OTP Inputs */}
                <div className="flex gap-2.5 mb-4" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      id={`reset-otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-full aspect-square text-center text-xl font-bold rounded-xl border-2 bg-white outline-none transition-all duration-200
                        ${digit ? "border-green-500 text-green-700 bg-green-50" : "border-gray-200 text-gray-900"}
                        focus:border-green-500 focus:ring-3 focus:ring-green-100 hover:border-gray-300`}
                      style={{ minWidth: 0 }}
                    />
                  ))}
                </div>

                {/* Progress bar */}
                <div className="flex gap-1 mb-2">
                  {otp.map((digit, i) => (
                    <div key={i}
                      className={`h-0.5 flex-1 rounded-full transition-all duration-300
                        ${digit ? "bg-green-500" : "bg-gray-200"}`}
                    />
                  ))}
                </div>

                {/* Countdown */}
                <p className={`text-xs mb-5 text-right font-medium
                  ${countdown < 60 ? "text-red-500" : "text-gray-400"}`}>
                  Expires in {formatTime(countdown)}
                </p>

                <button
                  id="verify-reset-otp-submit"
                  type="submit"
                  disabled={loading || !otpComplete}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed"
                  style={{
                    background: loading || !otpComplete ? "#d1d5db" : "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    color: loading || !otpComplete ? "#6b7280" : "white",
                    boxShadow: loading || !otpComplete ? "none" : "0 4px 14px rgba(5,150,105,0.35)",
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
                    <> Verify OTP <ArrowRight size={16} /> </>
                  )}
                </button>
              </form>

              {/* Resend */}
              <div className="flex items-center justify-center gap-2 mt-5">
                <p className="text-sm text-gray-500">Didn&apos;t receive it?</p>
                <button
                  id="resend-reset-otp"
                  onClick={handleResend}
                  disabled={countdown > 0 || resending}
                  className={`flex items-center gap-1.5 text-sm font-semibold transition-all
                    ${countdown > 0 ? "text-gray-400 cursor-not-allowed" : "text-green-600 hover:text-green-700"}`}
                >
                  <RefreshCw size={13} className={resending ? "animate-spin" : ""} />
                  Resend OTP
                  {countdown > 0 && <span className="font-normal text-gray-400">({formatTime(countdown)})</span>}
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2: NEW PASSWORD ── */}
          {step === "newPassword" && (
            <>
              <div className="mb-8">
                <div className="w-14 h-14 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-5">
                  <Lock size={26} className="text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Set new password</h1>
                <p className="text-gray-500 text-sm">
                  Create a strong password for your account.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* New Password */}
                {[
                  { key: "new", id: "reset-new-password", label: "New Password", value: newPassword, show: showNew, setShow: setShowNew, onChange: (e) => setNewPassword(e.target.value), placeholder: "Enter new password" },
                  { key: "confirm", id: "reset-confirm-password", label: "Confirm Password", value: confirmPassword, show: showConfirm, setShow: setShowConfirm, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "Repeat new password" },
                ].map(({ key, id, label, value, show, setShow, onChange, placeholder }) => (
                  <div key={key}>
                    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                    <div className={`relative flex items-center rounded-xl border transition-all duration-200 bg-white
                      ${focusedField === key ? "border-green-500 ring-3 ring-green-100 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}>
                      <Lock
                        size={16}
                        className={`absolute left-3.5 transition-colors ${focusedField === key ? "text-green-500" : "text-gray-400"}`}
                      />
                      <input
                        id={id}
                        type={show ? "text" : "password"}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        onFocus={() => setFocusedField(key)}
                        onBlur={() => setFocusedField(null)}
                        required
                        className="w-full pl-10 pr-11 py-3 bg-transparent text-gray-900 placeholder-gray-400 text-sm rounded-xl outline-none"
                      />
                      <button type="button" onClick={() => setShow((v) => !v)}
                        className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors">
                        {show ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Password strength */}
                {newPassword.length > 0 && (
                  <div>
                    <div className="flex gap-1.5">
                      {[...Array(4)].map((_, i) => {
                        const s = passwordStrength();
                        return (
                          <div key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300
                              ${i < s ? strengthColors[s - 1] : "bg-gray-200"}`}
                          />
                        );
                      })}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {["", "Weak", "Fair", "Good", "Strong"][passwordStrength()]} password
                    </p>
                  </div>
                )}

                {/* Password match indicator */}
                {confirmPassword.length > 0 && (
                  <p className={`text-xs font-medium ${newPassword === confirmPassword ? "text-green-600" : "text-red-500"}`}>
                    {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}

                <button
                  id="reset-password-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  style={{
                    background: loading ? "#6b7280" : "linear-gradient(135deg, #059669 0%, #047857 100%)",
                    boxShadow: loading ? "none" : "0 4px 14px rgba(5,150,105,0.35)",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Resetting...
                    </span>
                  ) : (
                    <> Reset Password <ArrowRight size={16} /> </>
                  )}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-gray-500 mt-6">
            Remembered it?{" "}
            <button onClick={() => navigate("/signin")}
              className="text-green-600 hover:text-green-700 font-semibold transition-colors">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
