import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const CreateFolder = () => {
  const [folderName, setFolderName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const foldersCollection = collection(db, 'carFolders');
      await addDoc(foldersCollection, {
        name: folderName,
        createdAt: new Date()
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Error creating folder: ", error);
      // TODO: Add error handling UI
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6">Skapa ny mapp</h1>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="mb-4">
            <Label htmlFor="folderName">Mapp namn</Label>
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