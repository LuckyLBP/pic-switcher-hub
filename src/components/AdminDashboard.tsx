import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRegistrationLink, db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const AdminDashboard = () => {
  const [email, setEmail] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(userList);
  };

  const handleCreateLink = async () => {
    const link = await createRegistrationLink(email);
    setRegistrationLink(link);
  };

  const handleToggleUpload = async (userId: string, currentStatus: boolean) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { canUploadPictures: !currentStatus });
    fetchUsers(); // Refresh the user list
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Skapa registreringslänk</h2>
        <div className="flex space-x-2">
          <Input
            type="email"
            placeholder="Kundens e-postadress"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={handleCreateLink}>Skapa länk</Button>
        </div>
        {registrationLink && (
          <div className="mt-4">
            <p>Registreringslänk:</p>
            <Input value={registrationLink} readOnly />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Hantera användare</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="text-left p-2">Företag</th>
              <th className="text-left p-2">E-post</th>
              <th className="text-left p-2">Kan ladda upp bilder</th>
              <th className="text-left p-2">Åtgärd</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-2">{user.companyName}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.canUploadPictures ? 'Ja' : 'Nej'}</td>
                <td className="p-2">
                  <Button onClick={() => handleToggleUpload(user.id, user.canUploadPictures)}>
                    {user.canUploadPictures ? 'Inaktivera' : 'Aktivera'} uppladdning
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;