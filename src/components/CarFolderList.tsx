import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CarFolder {
  id: string;
  name: string;
}

const CarFolderList = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<CarFolder[]>([]);

  useEffect(() => {
    const foldersCollection = collection(db, 'carFolders');
    const q = query(foldersCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const folderList = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setFolders(folderList);
    });

    return () => unsubscribe();
  }, []);

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
    </div>
  );
};

export default CarFolderList;