import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, storage } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';

const Gallery = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>([]);
  const [availableBackgrounds, setAvailableBackgrounds] = useState<string[]>([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

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
    fetchBackgrounds();
  }, [user]);

  const fetchBackgrounds = async () => {
    const listRef = ref(storage, 'backgrounds');
    const res = await listAll(listRef);
    const urls = await Promise.all(res.items.map(itemRef => getDownloadURL(itemRef)));
    setAvailableBackgrounds(urls);
  };

  const handleBackgroundToggle = async (backgroundUrl: string) => {
    if (isConfirmed) return; // Prevent changes after confirmation
    let newSelectedBackgrounds;
    if (selectedBackgrounds.includes(backgroundUrl)) {
      newSelectedBackgrounds = selectedBackgrounds.filter(url => url !== backgroundUrl);
    } else {
      if (selectedBackgrounds.length < userData.backgroundLimit) {
        newSelectedBackgrounds = [...selectedBackgrounds, backgroundUrl];
      } else {
        alert(`Du kan bara välja upp till ${userData.backgroundLimit} bakgrunder.`);
        return;
      }
    }
    setSelectedBackgrounds(newSelectedBackgrounds);
  };

  const handleConfirm = async () => {
    await updateDoc(doc(db, 'users', user.uid), { selectedBackgrounds });
    setIsConfirmed(true);
  };

  if (!userData) {
    return <div>Laddar...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-4">Galleri</h1>
        {userData?.isApproved ? (
          <div>
            {!isConfirmed && selectedBackgrounds.length < userData.backgroundLimit && (
              <>
                <h2 className="text-2xl font-bold mb-2">Välj bakgrunder</h2>
                <p className="mb-4">Du kan välja upp till {userData.backgroundLimit} bakgrunder. Du har valt {selectedBackgrounds.length}.</p>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {availableBackgrounds.map((bgUrl, index) => (
                    <div key={index} className="relative group">
                      <img src={bgUrl} alt={`Background ${index + 1}`} className="w-full h-40 object-cover" />
                      <div 
                        className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity ${
                          selectedBackgrounds.includes(bgUrl) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}
                        onClick={() => handleBackgroundToggle(bgUrl)}
                      >
                        <Check 
                          className={`text-white w-10 h-10 ${
                            selectedBackgrounds.includes(bgUrl) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {!isConfirmed && selectedBackgrounds.length > 0 && (
              <Button onClick={handleConfirm} className="mb-4">Bekräfta val</Button>
            )}
            {isConfirmed && (
              <>
                <p className="mb-4">Dina bakgrunder har sparats. Du kan nu ladda upp bilder.</p>
                <ImageUploader availableBackgrounds={selectedBackgrounds} />
              </>
            )}
          </div>
        ) : (
          <p>Ditt konto väntar på godkännande. Kontakta administratören för mer information.</p>
        )}
      </main>
    </div>
  );
};

export default Gallery;