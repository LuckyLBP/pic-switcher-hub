import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Plus, Image, Palette } from "lucide-react";
import CarFolderList from "@/components/CarFolderList";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import BackgroundSelector from "@/components/BackgroundSelector";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [remainingImages, setRemainingImages] = useState(0);
  const [usedBackgrounds, setUsedBackgrounds] = useState(0);
  const [isApproved, setIsApproved] = useState(false);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setRemainingImages(userData.uploadLimit - (userData.uploadCount || 0));
          setUsedBackgrounds(userData.selectedBackgrounds?.length || 0);
          setIsApproved(userData.isApproved || false);
          setShowBackgroundSelector(userData.backgroundLimit > 0 && !userData.selectedBackgrounds);
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (!isApproved) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Konto under granskning</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Ditt konto väntar på godkännande från en administratör. Vi kommer att meddela dig när ditt konto har godkänts.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        {showBackgroundSelector ? (
          <BackgroundSelector userId={user?.uid} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="mr-2" />
                    Skapa ny
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate("/create-folder")}>
                    Skapa ny mapp
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Image className="mr-2" />
                    Antal bilder kvar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{remainingImages}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="mr-2" />
                    Antal bakgrunder använda
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{usedBackgrounds}</p>
                </CardContent>
              </Card>
            </div>
            <CarFolderList />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;