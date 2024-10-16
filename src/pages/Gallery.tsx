import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";

const Gallery = () => {
  const [user] = useAuthState(auth);
  const [canUploadPictures, setCanUploadPictures] = useState(false);

  useEffect(() => {
    const checkUploadPermission = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCanUploadPictures(userDoc.data().canUploadPictures || false);
        }
      }
    };
    checkUploadPermission();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-4">Galleri</h1>
        {canUploadPictures ? (
          <div>
            <p className="mb-4">Här kan du ladda upp och hantera dina bilder.</p>
            <Button>Ladda upp bild</Button>
            {/* Add image upload component here */}
          </div>
        ) : (
          <p>Du har inte behörighet att ladda upp bilder än. Kontakta administratören för att aktivera denna funktion.</p>
        )}
      </main>
    </div>
  );
};

export default Gallery;