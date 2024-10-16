import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FolderOpenIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";

const CarFolderList = () => {
  const [folders, setFolders] = useState<any[]>([]);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolders = async () => {
      if (user) {
        const foldersCollection = collection(db, "carFolders");
        const q = query(foldersCollection, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const folderList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFolders(folderList);

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (
          userSnap.exists() &&
          (!userSnap.data().selectedBackgrounds ||
            userSnap.data().selectedBackgrounds.length === 0)
        ) {
          navigate("/select-backgrounds");
        }
      }
    };

    fetchFolders();
  }, [user, navigate]);

  if (folders.length === 0) {
    return (
      <div className="text-center mt-8">
        <p className="mb-4">Du har inga mappar än.</p>
        <Button
          onClick={() => navigate("/create-folder")}
          className="inline-flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Skapa din första mapp</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {folders.map((folder) => (
        <div
          key={folder.id}
          onClick={() => navigate(`/folder/${folder.id}`)}
          className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-200 cursor-pointer"
        >
          <div className="flex items-center mb-4">
            <FolderOpenIcon className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold">{folder.name}</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Antal bilder: {folder.imageCount || 0}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CarFolderList;
