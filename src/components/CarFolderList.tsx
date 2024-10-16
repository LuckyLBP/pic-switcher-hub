import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CarFolderList = () => {
  const [folders, setFolders] = useState<any[]>([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolders = async () => {
      if (user) {
        const foldersCollection = collection(db, 'carFolders');
        const q = query(foldersCollection, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const folderList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFolders(folderList);

        // Check if user has selected backgrounds
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && (!userSnap.data().selectedBackgrounds || userSnap.data().selectedBackgrounds.length === 0)) {
          navigate('/select-backgrounds');
        }
      }
    };

    fetchFolders();
  }, [user, navigate]);

  if (folders.length === 0) {
    return (
      <div className="text-center mt-8">
        <p className="mb-4">Du har inga mappar än.</p>
        <Button onClick={() => navigate('/create-folder')}>Skapa din första mapp</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {folders.map((folder) => (
        <Card key={folder.id}>
          <CardHeader>
            <CardTitle>{folder.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Link to={`/folder/${folder.id}`}>
              <Button>Öppna mapp</Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CarFolderList;