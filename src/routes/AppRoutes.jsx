import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Home from "../pages/Home";
import UserDashboard from "../pages/UserDashboard";
import Overview from "../components/UserDashboard/Overview";
import MyProblems from "../components/UserDashboard/MyProblems";
import MySolutions from "../components/UserDashboard/MySolutions";
import Rewards from "../components/UserDashboard/Rewards";
import Redemption from "../components/UserDashboard/Redemption";
import Settings from "../components/UserDashboard/Settings";



export default function AppRoutes() {
  const token = localStorage.getItem("accessToken");

  // No token? Only show auth pages
  if (!token) {
    return (
      <Routes>
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/signin" element={<SignIn />} /> {/* FIX: Change to SignIn */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    );
  }

  // Has token? Show all routes wrapped in Layout
  return (
    <Routes>
      {/* Wrap authenticated routes in Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
        <Route path="/signin" element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<UserDashboard />}>
          <Route index element={<Overview />} />
          <Route path="problems" element={<MyProblems />} />
          <Route path="solutions" element={<MySolutions />} />
          <Route path="points" element={<Rewards />} />
          <Route path="redemption" element={<Redemption />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all - redirect to home or dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}