import React from 'react';
import Navigation from '@/components/Navigation';
import AdminDashboard from '@/components/AdminDashboard';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <AdminDashboard />
      </main>
    </div>
  );
};

export default Admin;