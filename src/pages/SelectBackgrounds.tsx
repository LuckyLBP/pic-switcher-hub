import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';

const SelectBackgrounds = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [availableBackgrounds, setAvailableBackgrounds] = useState<string[]>([]);
  const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>([]);
  const [backgroundLimit, setBackgroundLimit] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setBackgroundLimit(userData.backgroundLimit || 0);
          
          // Fetch available backgrounds from your storage or database
          // This is a placeholder, replace with actual fetching logic
          const backgrounds = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg', 'bg5.jpg'];
          setAvailableBackgrounds(backgrounds);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleBackgroundSelect = (background: string) => {
    if (selectedBackgrounds.includes(background)) {
      setSelectedBackgrounds(selectedBackgrounds.filter(bg => bg !== background));
    } else if (selectedBackgrounds.length < backgroundLimit) {
      setSelectedBackgrounds([...selectedBackgrounds, background]);
    } else {
      toast.error(`Du kan bara välja upp till ${backgroundLimit} bakgrunder.`);
    }
  };

  const handleSaveSelection = async () => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { selectedBackgrounds });
    toast.success('Dina valda bakgrunder har sparats.');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6">Välj dina bakgrunder</h1>
        <p className="mb-4">Du kan välja upp till {backgroundLimit} bakgrunder.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {availableBackgrounds.map((bg, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer ${selectedBackgrounds.includes(bg) ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => handleBackgroundSelect(bg)}
            >
              <CardContent className="p-2">
                <img src={bg} alt={`Bakgrund ${index + 1}`} className="w-full h-32 object-cover" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Button 
          onClick={handleSaveSelection} 
          disabled={selectedBackgrounds.length === 0}
          className="w-full"
        >
          Spara valda bakgrunder
        </Button>
      </main>
    </div>
  );
};

export default SelectBackgrounds;