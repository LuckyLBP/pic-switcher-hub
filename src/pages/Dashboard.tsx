import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import CarFolderList from "@/components/CarFolderList";
import SidebarNavigation from "@/components/Navigation";
import { Star } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [remainingImages, setRemainingImages] = useState(0);
  const [usedBackgrounds, setUsedBackgrounds] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setRemainingImages(
            userData.uploadLimit - (userData.uploadCount || 0)
          );
          setUsedBackgrounds(userData.selectedBackgrounds?.length || 0);
          setIsApproved(userData.isApproved || false);
        }
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-10 w-10 text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  if (!isApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">
            Ditt konto behöver godkännas!
          </h2>
          <p>
            Ditt konto behöver godkännas innan du kan använda appen. Kontakta
            admin för mer information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SidebarNavigation />
      <div className="ml-64 w-full bg-gray-50 min-h-screen">
        <main className="container mx-auto px-4 pt-20 pb-8">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div
              className="bg-white shadow rounded-lg p-6 transform hover:scale-105 transition-transform duration-200 cursor-pointer"
              onClick={() => navigate("/create-folder")}
            >
              <div className="flex items-center mb-4">
                <PlusIcon className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-xl font-semibold">Skapa ny</h2>
              </div>
              <p className="text-gray-600">
                Skapa en ny mapp för att organisera dina bilar.
              </p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Star className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-xl font-semibold">Antal poäng kvar</h2>
              </div>
              <p className="text-4xl font-bold">{remainingImages}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Squares2X2Icon className="h-6 w-6 text-primary mr-2" />
                <h2 className="text-xl font-semibold">Antal bakgrunder</h2>
              </div>
              <p className="text-4xl font-bold">{usedBackgrounds}</p>
            </div>
          </div>
          <CarFolderList />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
