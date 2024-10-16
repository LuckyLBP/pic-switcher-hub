import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Navigation = () => {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [backgroundInfo, setBackgroundInfo] = useState<{ selected: number; limit: number } | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.role === 'admin');
          setBackgroundInfo({
            selected: userData.selectedBackgrounds?.length || 0,
            limit: userData.backgroundLimit || 0
          });
        }
      }
    };
    checkUserRole();
  }, [user]);

  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white p-4">
      <ul className="flex space-x-4 items-center">
        <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
        <li><Link to="/gallery" className="hover:underline">Galleri</Link></li>
        {isAdmin && (
          <li><Link to="/admin" className="hover:underline">Admin</Link></li>
        )}
        <li><Link to="/profile" className="hover:underline">Profil</Link></li>
        {backgroundInfo && backgroundInfo.selected < backgroundInfo.limit && (
          <li>
            <Link to="/select-backgrounds" className="hover:underline">
              Välj bakgrunder ({backgroundInfo.selected}/{backgroundInfo.limit})
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;