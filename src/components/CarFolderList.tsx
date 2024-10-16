import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CarFolder {
  id: string;
  name: string;
}

const CarFolderList = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<CarFolder[]>([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const foldersCollection = collection(db, 'carFolders');
      const folderSnapshot = await getDocs(foldersCollection);
      const folderList = folderSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setFolders(folderList);
    };

    fetchFolders();
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
            <p>Click to view images</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CarFolderList;