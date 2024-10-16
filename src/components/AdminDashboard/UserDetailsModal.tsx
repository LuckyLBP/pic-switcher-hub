import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserDetailsModalProps {
  user: any;
  onClose: () => void;
  onApprove: (userId: string) => void;
  onUpdate: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, onClose, onApprove, onUpdate }) => {
  const [uploadLimit, setUploadLimit] = useState(user.uploadLimit || 0);
  const [backgroundLimit, setBackgroundLimit] = useState(user.backgroundLimit || 0);

  const handleSave = async () => {
    const userRef = doc(db, 'users', user.id);
    await updateDoc(userRef, { uploadLimit, backgroundLimit });
    onUpdate();
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user.companyName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">E-post</Label>
            <Input id="email" value={user.email} readOnly className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contactPerson" className="text-right">Kontaktperson</Label>
            <Input id="contactPerson" value={user.contactPerson} readOnly className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phoneNumber" className="text-right">Telefon</Label>
            <Input id="phoneNumber" value={user.phoneNumber} readOnly className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="uploadLimit" className="text-right">Uppladdningsgräns</Label>
            <Input
              id="uploadLimit"
              type="number"
              value={uploadLimit}
              onChange={(e) => setUploadLimit(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="backgroundLimit" className="text-right">Bakgrundsgräns</Label>
            <Input
              id="backgroundLimit"
              type="number"
              value={backgroundLimit}
              onChange={(e) => setBackgroundLimit(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          {!user.isApproved && (
            <Button onClick={() => onApprove(user.id)} className="mr-auto">
              Godkänn användare
            </Button>
          )}
          <Button onClick={handleSave}>Spara ändringar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;