import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import { toast } from "sonner";
import SidebarNavigation from "@/components/Navigation";

const Profile = () => {
  const [user] = useAuthState(auth);
  const [profileData, setProfileData] = useState({
    email: user?.email || "",
    displayName: "",
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Fetch additional user profile data from Firestore
  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setProfileData({
            ...profileData,
            displayName: data.displayName || "",
          });
        }
      };
      fetchUserProfile();
    }
  }, [user]);

  // Handle updating the user's profile information
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { displayName: profileData.displayName });
        toast.success("Profilinformation uppdaterad.");
      } catch (error) {
        toast.error("Misslyckades att uppdatera profil.");
      }
    }
  };

  // Handle password update
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Lösenorden matchar inte.");
      return;
    }

    if (user && newPassword) {
      try {
        const credential = EmailAuthProvider.credential(
          user.email || "",
          prompt("Bekräfta nuvarande lösenord:")
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        toast.success("Lösenordet har uppdaterats.");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error) {
        toast.error("Misslyckades att uppdatera lösenord.");
      }
    }
  };

  // Handle account deletion
  const handleAccountDeletion = async () => {
    if (
      user &&
      window.confirm(
        "Är du säker på att du vill ta bort ditt konto? Detta går inte att ångra!"
      )
    ) {
      try {
        const credential = EmailAuthProvider.credential(
          user.email || "",
          prompt("Bekräfta ditt lösenord:")
        );
        await reauthenticateWithCredential(user, credential);
        const userRef = doc(db, "users", user.uid);
        await deleteDoc(userRef); // Remove user from Firestore
        await deleteUser(user); // Remove user from Firebase Auth
        toast.success("Kontot har raderats.");
        navigate("/"); // Redirect to homepage
      } catch (error) {
        toast.error("Misslyckades att ta bort konto.");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <SidebarNavigation />
      <div className="ml-64 w-full">
        <main className="container mx-auto mt-8 p-4">
          <h1 className="text-3xl font-bold mb-6">Profil</h1>
          <div className="space-y-8">
            {/* Profile Update Form */}
            <form
              onSubmit={handleProfileUpdate}
              className="bg-white shadow-lg rounded-lg p-6"
            >
              <h2 className="text-2xl font-semibold mb-4">Profilinformation</h2>
              <div className="mb-4">
                <Label htmlFor="email">E-post</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  disabled
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="displayName">Visningsnamn</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  value={profileData.displayName}
                  onChange={handleInputChange}
                  placeholder="Ange ditt namn"
                />
              </div>
              <Button type="submit">Uppdatera Profil</Button>
            </form>

            {/* Password Change Form */}
            <form
              onSubmit={handlePasswordChange}
              className="bg-white shadow-lg rounded-lg p-6"
            >
              <h2 className="text-2xl font-semibold mb-4">Ändra Lösenord</h2>
              <div className="mb-4">
                <Label htmlFor="newPassword">Nytt lösenord</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ange nytt lösenord"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="confirmPassword">Bekräfta lösenord</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Bekräfta nytt lösenord"
                />
              </div>
              <Button type="submit">Uppdatera Lösenord</Button>
            </form>

            {/* Account Deletion Section */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Ta bort konto</h2>
              <p className="text-red-500 mb-4">
                Varning: Att ta bort ditt konto är permanent och kan inte
                ångras.
              </p>
              <Button variant="destructive" onClick={handleAccountDeletion}>
                Ta bort mitt konto
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
