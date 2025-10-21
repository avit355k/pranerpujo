import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../component/Sidebar/Sidebar";
import Navbar from "../component/Navbar/Navbar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-emerald-50 text-black dark:bg-black dark:text-emerald-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar /> 
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout