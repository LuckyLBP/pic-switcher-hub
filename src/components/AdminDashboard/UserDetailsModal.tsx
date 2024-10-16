import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

interface UserDetailsModalProps {
  userId: string;
  onClose: () => void;
  onApprove: (userId: string) => Promise<void>;
  onDeny: (userId: string) => Promise<void>;
  onUpdate: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  userId,
  onClose,
  onUpdate,
}) => {
  const [user, setUser] = useState<any>(null);
  const [uploadLimit, setUploadLimit] = useState(0);
  const [backgroundLimit, setBackgroundLimit] = useState(0);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser(userData);
        setUploadLimit(userData.uploadLimit || 0);
        setBackgroundLimit(userData.backgroundLimit || 0);
        setIsApproved(userData.isApproved || false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleSave = async () => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      uploadLimit,
      backgroundLimit,
      isApproved,
      status: isApproved ? "approved" : "pending",
    });
    toast.success("Användarinställningar uppdaterade");
    onUpdate();
    onClose();
  };

  if (!user) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user.companyName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="uploadLimit" className="text-right">
              Uppladdningsgräns
            </Label>
            <Input
              id="uploadLimit"
              type="number"
              value={uploadLimit}
              onChange={(e) => setUploadLimit(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="backgroundLimit" className="text-right">
              Bakgrundsgräns
            </Label>
            <Input
              id="backgroundLimit"
              type="number"
              value={backgroundLimit}
              onChange={(e) => setBackgroundLimit(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isApproved" className="text-right">
              Godkänd
            </Label>
            <Input
              id="isApproved"
              type="checkbox"
              checked={isApproved}
              onChange={(e) => setIsApproved(e.target.checked)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Spara ändringar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
