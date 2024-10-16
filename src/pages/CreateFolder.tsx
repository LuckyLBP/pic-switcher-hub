import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { toast } from "sonner";

const CreateFolder = () => {
  const [folderName, setFolderName] = useState("");
  const navigate = useNavigate();
  const [user] = useAuthState(auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    try {
      const foldersCollection = collection(db, "carFolders");

      // Check if this is the user's first folder
      const userFoldersQuery = query(
        foldersCollection,
        where("userId", "==", user.uid)
      );
      const userFoldersSnapshot = await getDocs(userFoldersQuery);
      const isFirstFolder = userFoldersSnapshot.empty;

      await addDoc(foldersCollection, {
        name: folderName,
        createdAt: new Date(),
        userId: user.uid,
      });

      if (isFirstFolder) {
        toast.success("Första mappen skapad! Välj nu dina bakgrunder.");
        navigate("/select-backgrounds");
      } else {
        toast.success("Mapp skapad");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error creating folder: ", error);
      toast.error("Ett fel uppstod när mappen skulle skapas");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="flex justify-center items-center py-12">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Skapa Ny Mapp
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <Label
                htmlFor="folderName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mappnamn
              </Label>
              <Input
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="T.ex. Audi A6"
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 ease-in-out"
            >
              Skapa Mapp
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateFolder;
