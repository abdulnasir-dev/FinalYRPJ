import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.api";
import toast from "react-hot-toast";
import { Eye, EyeOff, Leaf, ArrowRight, Mail, Lock, User } from "lucide-react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      await toast.promise(
        registerUser(payload),
        {
          loading: "Sending OTP...",
          success: "OTP sent to your email",
          error: (err) => err?.response?.data?.message || "Registration failed",
        }
      );
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      console.error("Signup failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      id: "signup-name",
      key: "name",
      label: "Full Name",
      type: "text",
      placeholder: "John Doe",
      value: name,
      icon: User,
      autoComplete: "name",
      onChange: (e) => setName(e.target.value),
    },
    {
      id: "signup-email",
      key: "email",
      label: "Email address",
      type: "email",
      placeholder: "you@example.com",
      value: email,
      icon: Mail,
      autoComplete: "email",
      onChange: (e) => setEmail(e.target.value),
    },
  ];

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
            Join 2,000+ change-makers
          </div>
          <h2 className="text-4xl font-bold text-white leading-snug mb-4">
            Start making<br />
            a real<br />
            <span className="text-green-300">impact today</span>
          </h2>
          <p className="text-green-100/80 text-base leading-relaxed max-w-xs">
            Submit sustainability problems, propose solutions, collaborate with experts, and earn rewards for your contributions.
          </p>

          {/* Feature list */}
          <div className="mt-8 space-y-3">
            {[
              "Submit & solve environmental challenges",
              "Earn points & climb the leaderboard",
              "Connect with sustainability experts",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0 border border-green-400/30">
                  <svg className="w-2.5 h-2.5 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-green-100/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM PANEL ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 overflow-y-auto">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <img src="/favicon.png" alt="ImpactHub" className="w-9 h-9 rounded-xl object-contain" />
          <span className="text-gray-900 text-xl font-bold">ImpactHub</span>
        </div>

        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
            <p className="text-gray-500 text-sm">Join the ImpactHub community for free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name & Email */}
            {fields.map(({ id, key, label, type, placeholder, value, icon: Icon, autoComplete, onChange }) => (
              <div key={key}>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
                  {label}
                </label>
                <div className={`relative flex items-center rounded-xl border transition-all duration-200 bg-white
                  ${focusedField === key
                    ? "border-green-500 ring-3 ring-green-100 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Icon
                    size={16}
                    className={`absolute left-3.5 transition-colors duration-200
                      ${focusedField === key ? "text-green-500" : "text-gray-400"}`}
                  />
                  <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocusedField(key)}
                    onBlur={() => setFocusedField(null)}
                    autoComplete={autoComplete}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-400 text-sm rounded-xl outline-none"
                  />
                </div>
              </div>
            ))}

            {/* Password */}
            {[
              { key: "password", label: "Password", value: password, show: showPassword, setShow: setShowPassword, onChange: (e) => setPassword(e.target.value), id: "signup-password", placeholder: "Create a password" },
              { key: "confirmPassword", label: "Confirm Password", value: confirmPassword, show: showConfirmPassword, setShow: setShowConfirmPassword, onChange: (e) => setConfirmPassword(e.target.value), id: "signup-confirm-password", placeholder: "Repeat your password" },
            ].map(({ key, label, value, show, setShow, onChange, id, placeholder }) => (
              <div key={key}>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
                  {label}
                </label>
                <div className={`relative flex items-center rounded-xl border transition-all duration-200 bg-white
                  ${focusedField === key
                    ? "border-green-500 ring-3 ring-green-100 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Lock
                    size={16}
                    className={`absolute left-3.5 transition-colors duration-200
                      ${focusedField === key ? "text-green-500" : "text-gray-400"}`}
                  />
                  <input
                    id={id}
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocusedField(key)}
                    onBlur={() => setFocusedField(null)}
                    autoComplete={key === "password" ? "new-password" : "new-password"}
                    required
                    className="w-full pl-10 pr-11 py-3 bg-transparent text-gray-900 placeholder-gray-400 text-sm rounded-xl outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}

            {/* Password strength hint */}
            {password.length > 0 && (
              <div className="flex gap-1.5">
                {[...Array(4)].map((_, i) => {
                  const strength =
                    (password.length >= 8 ? 1 : 0) +
                    (/[A-Z]/.test(password) ? 1 : 0) +
                    (/[0-9]/.test(password) ? 1 : 0) +
                    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);
                  const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
                  return (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strength ? colors[strength - 1] : "bg-gray-200"}`}
                    />
                  );
                })}
              </div>
            )}

            {/* Submit */}
            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
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
                  Creating account...
                </span>
              ) : (
                <>
                  Create Account
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <button
              id="go-to-signin"
              onClick={() => navigate("/signin")}
              className="text-green-600 hover:text-green-700 font-semibold transition-colors"
            >
              Sign in
            </button>
          </p>

          <p className="text-center text-xs text-gray-400 mt-4">
            By creating an account, you agree to our{" "}
            <span className="text-green-600 cursor-pointer hover:underline">Terms of Service</span>{" "}
            and{" "}
            <span className="text-green-600 cursor-pointer hover:underline">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;