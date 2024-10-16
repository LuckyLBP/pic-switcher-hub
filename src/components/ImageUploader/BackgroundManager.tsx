import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import BackgroundSelector from './BackgroundSelector';

interface BackgroundManagerProps {
  onSelectBackground: (background: string) => void;
}

const BackgroundManager: React.FC<BackgroundManagerProps> = ({ onSelectBackground }) => {
  const [backgrounds, setBackgrounds] = useState<string[]>([]);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);

  useEffect(() => {
    fetchBackgrounds();
  }, []);

  const fetchBackgrounds = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setBackgrounds(['Ta bort bakgrund', ...(userData.selectedBackgrounds || [])]);
      }
    }
  };

  const handleSelectBackground = (background: string) => {
    onSelectBackground(background);
    setShowBackgroundSelector(false);
  };

  return (
    <div>
      <Button
        onClick={() => setShowBackgroundSelector(true)}
        className="w-full"
      >
        Välj bakgrund
      </Button>
      {showBackgroundSelector && (
        <BackgroundSelector
          backgrounds={backgrounds}
          selectedBackground={null}
          onSelectBackground={handleSelectBackground}
        />
      )}
    </div>
  );
};

export default BackgroundManager;