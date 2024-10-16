import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleLogout}>Logga ut</Button>
      </header>
      <main className="container mx-auto mt-8 p-4">
        <h2 className="text-2xl mb-4">Bildhantering</h2>
        <p className="mb-4">Här kommer du snart att kunna ladda upp och redigera dina bilbilder.</p>
      </main>
    </div>
  );
};

export default Dashboard;