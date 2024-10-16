import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'sonner';

const CreateFolder = () => {
  const [folderName, setFolderName] = useState('');
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    try {
      const foldersCollection = collection(db, 'carFolders');
      
      // Check if this is the user's first folder
      const userFoldersQuery = query(foldersCollection, where("userId", "==", user.uid));
      const userFoldersSnapshot = await getDocs(userFoldersQuery);
      const isFirstFolder = userFoldersSnapshot.empty;

      await addDoc(foldersCollection, {
        name: folderName,
        createdAt: new Date(),
        userId: user.uid
      });

      if (isFirstFolder) {
        toast.success('Första mappen skapad! Välj nu dina bakgrunder.');
        navigate('/select-backgrounds');
      } else {
        toast.success('Mapp skapad');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Error creating folder: ", error);
      toast.error('Ett fel uppstod när mappen skulle skapas');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6">Skapa ny mapp</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <Label htmlFor="folderName">Mappnamn</Label>
            <Input
              id="folderName"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="T.ex. Audi A6"
              required
            />
          </div>
          <Button type="submit">Skapa mapp</Button>
        </form>
      </main>
    </div>
  );
};

export default CreateFolder;