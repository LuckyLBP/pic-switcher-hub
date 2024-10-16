import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, onSnapshot, query } from 'firebase/firestore';
import UserDetailsModal from './UserDetailsModal';
import { Badge } from "@/components/ui/badge";

const UserManager = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    });

    return () => unsubscribe();
  }, []);

  const handleApproveUser = async (userId: string) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { isApproved: true, status: 'approved' });
  };

  const handleDenyUser = async (userId: string) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { isApproved: false, status: 'denied' });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Godkänd</Badge>;
      case 'denied':
        return <Badge variant="destructive">Nekad</Badge>;
      default:
        return <Badge variant="secondary" className="bg-yellow-500">Väntande</Badge>;
    }
  };

  return (
    <div className="space-y-4 overflow-x-auto">
      <h2 className="text-2xl font-bold">Hantera användare</h2>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="text-left p-2">Företag</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Bilder kvar</th>
              <th className="text-left p-2">Valda bakgrunder</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td 
                  className="p-2 cursor-pointer text-blue-600 hover:underline"
                  onClick={() => setSelectedUserId(user.id)}
                >
                  {user.companyName}
                </td>
                <td className="p-2">
                  {getStatusBadge(user.status || 'pending')}
                </td>
                <td className="p-2">
                  {user.uploadLimit - (user.uploadCount || 0)}
                </td>
                <td className="p-2">
                  {user.selectedBackgrounds?.length || 0} / {user.backgroundLimit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUserId && (
        <UserDetailsModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
          onApprove={handleApproveUser}
          onDeny={handleDenyUser}
          onUpdate={() => {}} // This is now handled by the onSnapshot
        />
      )}
    </div>
  );
};

export default UserManager;