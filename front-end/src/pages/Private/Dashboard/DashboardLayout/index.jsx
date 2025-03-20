import { Sidebar } from "@/components/Dashboard/Shared";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

/* eslint-disable react/prop-types */
const DashboardLayout = () => {
  useEffect(() => {
    import('@/css/dashboard/index.css')
  }, [])
  return (
    <div className="dashboard-layout mt-3 p-4">
      <Sidebar />
      <Outlet />
    </div>
  );
}

export default DashboardLayout