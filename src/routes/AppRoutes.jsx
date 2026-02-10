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
import CreateProblem from "../components/UserDashboard/CreateProblem";
import Notifications from "../components/UserDashboard/Notifications";

import Users from "../components/AdminDashboard/Users";
import Problem from "../components/Problem";
import AdminDashboard from "../pages/AdminDashboard";
import Analytics from "@/components/AdminDashboard/Analytics";
import Requests from "@/components/AdminDashboard/Requests";
import AdminLogs from "@/components/AdminDashboard/AdminLogs";
import AdminProblem from "@/components/AdminDashboard/AdminProblem";
import AdminSolutions from "@/components/AdminDashboard/AdminSolutions";
import Profile from "@/components/UserDashboard/Profile";
import MyProfile from "@/components/UserDashboard/MyProfile";
import EditProblem from "@/components/EditProblem";

const RequireAdmin = ({ children }) => {
  const role = localStorage.getItem("role");
  return role === "admin"
    ? children
    : <Navigate to="/dashboard" replace />;
};

export default function AppRoutes() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return (
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      {/* ================= USER / PUBLIC LAYOUT ================= */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/problems/:problemId" element={<Problem />} />
        <Route path="/problems/:problemId/edit" element={<EditProblem />} />

        <Route path="/dashboard" element={<UserDashboard />}>
          <Route index element={<Overview />} />
          <Route path="problems" element={<MyProblems />} />
          <Route path="solutions" element={<MySolutions />} />
          <Route path="points" element={<Rewards />} />
          <Route path="redemption" element={<Redemption />} />
          <Route path="settings" element={<Settings />} />
          <Route path="create" element={<CreateProblem />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile/:userId" element={<Profile />} />
          <Route path="my-profile" element={<MyProfile />} />
        </Route>
      </Route>

      {/* ================= ADMIN (NO LAYOUT WRAP) ================= */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      >
        <Route index element={<Analytics />} />
        <Route path="users" element={<Users />} />
        <Route path="requests" element={<Requests />} />
        <Route path="logs" element={<AdminLogs />} />
        <Route path="all-problems" element={<AdminProblem />} />
        <Route path="all-solutions" element={<AdminSolutions />} />
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
