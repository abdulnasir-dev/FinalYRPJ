import React from "react";
import { Outlet } from "react-router-dom";

const UserDashboard = () => {
    return (
        <div className="h-full overflow-y-auto bg-[#ffffff] p-4">
            <Outlet />
        </div>
    );
};

export default UserDashboard;