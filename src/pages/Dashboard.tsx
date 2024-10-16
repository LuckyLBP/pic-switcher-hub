import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import AdminDashboard from '@/components/AdminDashboard';
import { doc, getDoc } from 'firebase/firestore';
import Navigation from '@/components/Navigation';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        }
      }
    };
    checkUserRole();
  }, [user]);

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
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        {isAdmin ? (
          <AdminDashboard />
        ) : (
          <>
            <h2 className="text-2xl mb-4">Välkommen, {user?.email}</h2>
            <p className="mb-4">Här kommer du snart att kunna hantera dina bilbilder.</p>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;