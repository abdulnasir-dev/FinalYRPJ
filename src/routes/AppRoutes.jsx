import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import UserDashboard from "../pages/UserDashboard";
import Overview from "../components/UserDashboard/Overview";
import MyProblems from "../components/UserDashboard/MyProblems";
import MySolutions from "../components/UserDashboard/MySolutions";
import Rewards from "../components/UserDashboard/Rewards";
import Redemption from "../components/UserDashboard/Redemption";
import Settings from "../components/UserDashboard/Settings";



export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="dashboard" element={<UserDashboard />}>
        <Route index element={<Overview />} />
        <Route path="problems" element={<MyProblems />} />
        <Route path="solutions" element={<MySolutions />} />
        <Route path="points" element={<Rewards />} />
        <Route path="redemption" element={<Redemption />} />
        <Route path="settings" element={<Settings /> } />
      </Route>
    </Routes>
  );
}
