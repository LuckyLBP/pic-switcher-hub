import React from "react";
import SidebarNavigation from "@/components/Navigation";
import AdminDashboard from "@/components/AdminDashboard";

const Admin = () => {
  return (
    <div className="flex">
      <SidebarNavigation />
      <div className="ml-64 w-full bg-gray-50 min-h-screen">
        <main className="container mx-auto px-4 pt-20 pb-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          <AdminDashboard />
        </main>
      </div>
    </div>
  );
};

export default Admin;
