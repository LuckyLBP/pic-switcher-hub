import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserDetailsModalProps {
  userId: string;
  onClose: () => void;
  onApprove: (userId: string) => void;
  onDeny: (userId: string) => void;
  onUpdate: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ userId, onClose, onApprove, onDeny, onUpdate }) => {
  const [user, setUser] = useState<any>(null);
  const [uploadLimit, setUploadLimit] = useState(0);
  const [backgroundLimit, setBackgroundLimit] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setUser(userData);
        setUploadLimit(userData.uploadLimit || 0);
        setBackgroundLimit(userData.backgroundLimit || 0);
        setIsDisabled(userData.isDisabled || false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleSave = async () => {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { uploadLimit, backgroundLimit, isDisabled });
    onUpdate();
    onClose();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-500">Godkänd</Badge>;
      case 'denied':
        return <Badge variant="destructive">Nekad</Badge>;
      default:
        return <Badge variant="secondary" className="bg-yellow-500">Väntande</Badge>;
    }
  };

  if (!user) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{user.companyName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid sm:grid-cols-4 items-center gap-2">
            <Label htmlFor="email" className="sm:text-right">E-post</Label>
            <Input id="email" value={user.email} readOnly className="sm:col-span-3" />
          </div>
          <div className="grid sm:grid-cols-4 items-center gap-2">
            <Label htmlFor="contactPerson" className="sm:text-right">Kontaktperson</Label>
            <Input id="contactPerson" value={user.contactPerson} readOnly className="sm:col-span-3" />
          </div>
          <div className="grid sm:grid-cols-4 items-center gap-2">
            <Label htmlFor="phoneNumber" className="sm:text-right">Telefon</Label>
            <Input id="phoneNumber" value={user.phoneNumber} readOnly className="sm:col-span-3" />
          </div>
          <div className="grid sm:grid-cols-4 items-center gap-2">
            <Label htmlFor="status" className="sm:text-right">Status</Label>
            <div className="sm:col-span-3">{getStatusBadge(user.status || 'pending')}</div>
          </div>
          <div className="grid sm:grid-cols-4 items-center gap-2">
            <Label htmlFor="uploadLimit" className="sm:text-right">Uppladdningsgräns</Label>
            <Input
              id="uploadLimit"
              type="number"
              value={uploadLimit}
              onChange={(e) => setUploadLimit(Number(e.target.value))}
              className="sm:col-span-3"
            />
          </div>
          <div className="grid sm:grid-cols-4 items-center gap-2">
            <Label htmlFor="backgroundLimit" className="sm:text-right">Bakgrundsgräns</Label>
            <Input
              id="backgroundLimit"
              type="number"
              value={backgroundLimit}
              onChange={(e) => setBackgroundLimit(Number(e.target.value))}
              className="sm:col-span-3"
            />
          </div>
          <div className="grid sm:grid-cols-4 items-center gap-2">
            <Label htmlFor="isDisabled" className="sm:text-right">Inaktivera konto</Label>
            <Input
              id="isDisabled"
              type="checkbox"
              checked={isDisabled}
              onChange={(e) => setIsDisabled(e.target.checked)}
              className="sm:col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            {user.status !== 'approved' && (
              <Button onClick={() => onApprove(userId)} className="w-full sm:w-auto">
                Godkänn användare
              </Button>
            )}
            {user.status !== 'denied' && (
              <Button onClick={() => onDeny(userId)} variant="destructive" className="w-full sm:w-auto">
                Neka användare
              </Button>
            )}
            <Button onClick={handleSave} className="w-full sm:w-auto">Spara ändringar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;