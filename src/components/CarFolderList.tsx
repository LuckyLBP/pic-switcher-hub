import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder } from 'lucide-react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'sonner';

interface CarFolder {
  id: string;
  name: string;
}

const CarFolderList = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<CarFolder[]>([]);
  const [user] = useAuthState(auth);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const foldersCollection = collection(db, 'carFolders');
    const q = query(
      foldersCollection,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const folderList = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setFolders(folderList);
        setError(null);
      },
      (err) => {
        console.error("Error fetching folders:", err);
        setError("Det gick inte att hämta mapparna. Försök igen senare.");
        toast.error("Det gick inte att hämta mapparna. Försök igen senare.");
      }
    );

    return () => unsubscribe();
  }, [user]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {folders.map((folder) => (
        <Card 
          key={folder.id} 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate(`/folder/${folder.id}`)}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Folder className="mr-2" />
              {folder.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Klicka för att visa bilder</p>
          </CardContent>
        </Card>
      ))}
      {folders.length === 0 && !error && (
        <p className="col-span-3 text-center text-gray-500">Inga mappar hittades. Skapa en ny mapp för att börja.</p>
      )}
    </div>
  );
};

export default CarFolderList;