import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const backgrounds = [
  { id: 'studio', label: 'Studio' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'showroom', label: 'Showroom' },
  { id: 'custom', label: 'Custom' },
];

const Gallery = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
          setSelectedBackgrounds(userDoc.data().selectedBackgrounds || []);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleBackgroundToggle = async (backgroundId: string) => {
    let newSelectedBackgrounds;
    if (selectedBackgrounds.includes(backgroundId)) {
      newSelectedBackgrounds = selectedBackgrounds.filter(id => id !== backgroundId);
    } else {
      if (selectedBackgrounds.length < userData.backgroundLimit) {
        newSelectedBackgrounds = [...selectedBackgrounds, backgroundId];
      } else {
        alert(`Du kan bara välja upp till ${userData.backgroundLimit} bakgrunder.`);
        return;
      }
    }
    setSelectedBackgrounds(newSelectedBackgrounds);
    await updateDoc(doc(db, 'users', user.uid), { selectedBackgrounds: newSelectedBackgrounds });
  };

  if (!userData) {
    return <div>Laddar...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-4">Galleri</h1>
        {userData.isApproved ? (
          <div>
            <h2 className="text-2xl font-bold mb-2">Välj bakgrunder</h2>
            <p className="mb-4">Du kan välja upp till {userData.backgroundLimit} bakgrunder.</p>
            <div className="space-y-2 mb-4">
              {backgrounds.map((bg) => (
                <div key={bg.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={bg.id}
                    checked={selectedBackgrounds.includes(bg.id)}
                    onCheckedChange={() => handleBackgroundToggle(bg.id)}
                  />
                  <label htmlFor={bg.id}>{bg.label}</label>
                </div>
              ))}
            </div>
            <p className="mb-4">Du kan ladda upp totalt {userData.uploadLimit} bilder.</p>
            <Button>Ladda upp bild</Button>
            {/* Add image upload component here */}
          </div>
        ) : (
          <p>Din konto väntar på godkännande. Kontakta administratören för mer information.</p>
        )}
      </main>
    </div>
  );
};

export default Gallery;