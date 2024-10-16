import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRegistrationLink, db, storage } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import ImageModal from './ImageModal';

const AdminDashboard = () => {
  const [email, setEmail] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);


  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userImages, setUserImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchBackgroundImages();
  }, []);

  const fetchUsers = async () => {
    const usersCollection = collection(db, 'users');
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(userList);
  };

  const fetchBackgroundImages = async () => {
    const listRef = ref(storage, 'backgrounds');
    const res = await listAll(listRef);
    const urls = await Promise.all(res.items.map(itemRef => getDownloadURL(itemRef)));
    setBackgroundImages(urls);
  };

  const handleCreateLink = async () => {
    const link = await createRegistrationLink(email);
    setRegistrationLink(link);
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

  const handleBackgroundUpload = async () => {
    if (backgroundImage) {
      const storageRef = ref(storage, `backgrounds/${backgroundImage.name}`);
      await uploadBytes(storageRef, backgroundImage);
      await fetchBackgroundImages();
      setBackgroundImage(null);
    }
  };

  const handleBackgroundDelete = async (imageUrl: string) => {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    await fetchBackgroundImages();
  };

  const handleViewUserImages = async (userId: string) => {
    setSelectedUser(userId);
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      setUserImages(userDoc.data().savedImages || []);
    }
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div className="space-y-8">
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
        <h2 className="text-2xl font-bold">Ladda upp bakgrundsbild</h2>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setBackgroundImage(e.target.files?.[0] || null)}
        />
        <Button onClick={handleBackgroundUpload} disabled={!backgroundImage}>
          Ladda upp bakgrund
        </Button>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Bakgrundsbilder</h2>
        <div className="grid grid-cols-3 gap-4">
          {backgroundImages.map((imageUrl, index) => (
            <div key={index} className="relative">
              <img src={imageUrl} alt={`Background ${index + 1}`} className="w-full h-40 object-cover" />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleBackgroundDelete(imageUrl)}
              >
                Ta bort
              </Button>
            </div>
          ))}
        </div>
      </div>

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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Customer Images</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="text-left p-2">Company</th>
              <th className="text-left p-2">E-mail</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-2">{user.companyName}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">
                  <Button onClick={() => handleViewUserImages(user.id)}>
                    View Images
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">User Images</h3>
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

export default AdminDashboard;
