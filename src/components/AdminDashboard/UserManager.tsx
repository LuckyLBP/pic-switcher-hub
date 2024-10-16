import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import ImageModal from '../ImageModal';

const UserManager = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userImages, setUserImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const handleSetLimits = async (userId: string, uploadLimit: number, backgroundLimit: number) => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { uploadLimit, backgroundLimit });
    fetchUsers();
  };

  const handleViewUserImages = async (userId: string) => {
    setSelectedUser(userId);
    const userDoc = await getDocs(doc(db, 'users', userId));
    if (userDoc.exists()) {
      setUserImages(userDoc.data().savedImages || []);
    }
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Hantera användare</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="text-left p-2">Företag</th>
            <th className="text-left p-2">E-post</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Uppladdningsgräns</th>
            <th className="text-left p-2">Bakgrundsgräns</th>
            <th className="text-left p-2">Åtgärder</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="p-2">{user.companyName}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.isApproved ? 'Godkänd' : 'Väntar'}</td>
              <td className="p-2">{user.uploadLimit}</td>
              <td className="p-2">{user.backgroundLimit}</td>
              <td className="p-2">
                {!user.isApproved && (
                  <Button onClick={() => handleApproveUser(user.id)}>
                    Godkänn
                  </Button>
                )}
                <Button onClick={() => handleSetLimits(user.id, 10, 5)}>
                  Sätt gränser
                </Button>
                <Button onClick={() => handleViewUserImages(user.id)}>
                  Visa bilder
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedUser && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Användarbilder</h3>
          <div className="grid grid-cols-4 gap-4">
            {userImages.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`User image ${index + 1}`}
                className="w-full h-40 object-cover cursor-pointer"
                onClick={() => openImageModal(imageUrl)}
              />
            ))}
          </div>
        </div>
      )}

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};

export default UserManager;