import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';

const Navigation = () => {
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

  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white p-4">
      <ul className="flex space-x-4">
        <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
        <li><Link to="/gallery" className="hover:underline">Galleri</Link></li>
        {isAdmin && (
          <li><Link to="/admin" className="hover:underline">Admin</Link></li>
        )}
        <li><Link to="/profile" className="hover:underline">Profil</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;