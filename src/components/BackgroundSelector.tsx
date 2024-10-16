import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

interface BackgroundSelectorProps {
  userId: string | undefined;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ userId }) => {
  const [availableBackgrounds, setAvailableBackgrounds] = useState<string[]>([]);
  const [selectedBackgrounds, setSelectedBackgrounds] = useState<string[]>([]);
  const [backgroundLimit, setBackgroundLimit] = useState(0);

  useEffect(() => {
    const fetchBackgrounds = async () => {
      if (!userId) return;

      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setBackgroundLimit(userData.backgroundLimit || 0);
        
        // Fetch available backgrounds from your storage or database
        // This is a placeholder, replace with actual fetching logic
        const backgrounds = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg', 'bg5.jpg'];
        setAvailableBackgrounds(backgrounds);
      }
    };

    fetchBackgrounds();
  }, [userId]);

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
    if (!userId) return;

    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { selectedBackgrounds });
    toast.success('Dina valda bakgrunder har sparats.');
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Välj dina bakgrunder</h2>
      <p>Du kan välja upp till {backgroundLimit} bakgrunder.</p>
      <div className="grid grid-cols-3 gap-4">
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
      <Button onClick={handleSaveSelection} disabled={selectedBackgrounds.length === 0}>
        Spara valda bakgrunder
      </Button>
    </div>
  );
};

export default BackgroundSelector;