import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserDetailsModalProps {
  userId: string;
  onClose: () => void;
  onApprove: (userId: string) => void;
  onDeny: (userId: string) => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  userId,
  onClose,
  onApprove,
  onDeny,
}) => {
  const [user, setUser] = useState<any>(null);
  const [uploadLimit, setUploadLimit] = useState(0);
  const [backgroundLimit, setBackgroundLimit] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(userData);
        setUploadLimit(userData.uploadLimit || 0);
        setBackgroundLimit(userData.backgroundLimit || 0);
      }
    };
    fetchUser();
  }, [userId]);

  // Handle updating limits in Firestore
  const handleUpdate = async () => {
    if (userId) {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        uploadLimit: Number(uploadLimit),
        backgroundLimit: Number(backgroundLimit),
      });
      alert("Bilduppladdningar och Antal Bakgrunder uppdaterades");
    }
  };

  // Approve the user (set isApproved: true)
  const handleApprove = async () => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { isApproved: true });
    alert("Användaren har godkänts.");
    onApprove(userId);
  };

  // Deny the user (set isApproved: false) Also reset there limits
  const handleDeny = async () => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      isApproved: false,
      backgroundLimit: 0,
      uploadLimit: 0,
    });
    alert("Användaren har nekats.");
    onDeny(userId);
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">{user.companyName}</h2>
        <p>
          <strong>E-post:</strong> {user.email}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          {user.isApproved ? "Godkänd" : "Inte godkänd"}
        </p>
        <div className="mt-4">
          <Label htmlFor="uploadLimit">Bilduppladdningar</Label>
          <Input
            id="uploadLimit"
            type="number"
            value={uploadLimit}
            onChange={(e) => setUploadLimit(Number(e.target.value))}
          />
        </div>
        <div className="mt-4">
          <Label htmlFor="backgroundLimit">Antal Bakgrunder</Label>
          <Input
            id="backgroundLimit"
            type="number"
            value={backgroundLimit}
            onChange={(e) => setBackgroundLimit(Number(e.target.value))}
          />
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="secondary" onClick={onClose}>
            Stäng
          </Button>
          {user.isApproved && (
            <Button variant="destructive" onClick={handleDeny}>
              Neka
            </Button>
          )}
          <Button variant="destructive" onClick={handleDeny}>
            Neka
          </Button>
          {/* Hide "Godkänn" button if the user is already approved */}
          {!user.isApproved && <Button onClick={handleApprove}>Godkänn</Button>}
          <Button onClick={handleUpdate}>Uppdatera</Button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
