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
import Problem from "../components/Problem";
import CreateProblem from "../components/UserDashboard/CreateProblem";



export default function AppRoutes() {
  const token = localStorage.getItem("accessToken");

  /* ======================
     NO TOKEN → AUTH ONLY
  ====================== */
  if (!token) {
    return (
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    );
  }

  /* ======================
     AUTHENTICATED ROUTES
  ====================== */
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Problem detail (PUBLIC but authenticated) */}
        <Route path="/problems/:problemId" element={<Problem />} />

        {/* Prevent auth pages when logged in */}
        <Route path="/signup" element={<Navigate to="/dashboard" replace />} />
        <Route path="/signin" element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<UserDashboard />}>
          <Route index element={<Overview />} />
          <Route path="problems" element={<MyProblems />} />
          <Route path="solutions" element={<MySolutions />} />
          <Route path="points" element={<Rewards />} />
          <Route path="redemption" element={<Redemption />} />
          <Route path="settings" element={<Settings />} />
          <Route path="create" element={<CreateProblem />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
