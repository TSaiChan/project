import React from "react";
import { Routes, Route } from "react-router-dom";
import UserLayout from "./UserLayout";
import HomeOverview from "./HomeOverview";
import Payments from "./Payments";
import Notifications from "./Notifications";
import MaintenanceRequests from "./MaintenanceRequests";
import VisitorLogs from "./VisitorLogs";

const UserDashboard = () => {
    return (
        <Routes>
            <Route path="/" element={<UserLayout />}>
                <Route index element={<HomeOverview />} />
                <Route path="payments" element={<Payments />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="maintenance" element={<MaintenanceRequests />} />
                <Route path="visitors" element={<VisitorLogs />} />
                <Route path="*" element={<div>Page Not Found</div>} />
            </Route>
        </Routes>
    );
};

export default UserDashboard;
