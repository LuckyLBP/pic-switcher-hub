import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import UserDetailsModal from './UserDetailsModal';
import { Badge } from "@/components/ui/badge";

const UserManager = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(userList);
  };

  const handleApproveUser = async (userId: string) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { isApproved: true });
    fetchUsers();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Hantera användare</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="text-left p-2">Företag</th>
            <th className="text-left p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-100">
              <td 
                className="p-2 cursor-pointer text-blue-600 hover:underline"
                onClick={() => setSelectedUser(user)}
              >
                {user.companyName}
              </td>
              <td className="p-2">
                <Badge variant={user.isApproved ? "success" : "destructive"}>
                  {user.isApproved ? 'Godkänd' : 'Väntar'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onApprove={handleApproveUser}
          onUpdate={fetchUsers}
        />
      )}
    </div>
  );
};

export default UserManager;