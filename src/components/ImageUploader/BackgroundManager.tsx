import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import BackgroundSelector from './BackgroundSelector';

interface BackgroundManagerProps {
  onSelectBackground: (background: string) => void;
}

const BackgroundManager: React.FC<BackgroundManagerProps> = ({ onSelectBackground }) => {
  const [backgrounds, setBackgrounds] = useState<string[]>([]);

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

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Välj bakgrund:</h3>
      <BackgroundSelector
        backgrounds={backgrounds}
        selectedBackground={null}
        onSelectBackground={onSelectBackground}
      />
    </div>
  );
};

export default BackgroundManager;