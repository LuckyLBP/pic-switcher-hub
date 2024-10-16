import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface UserDetailsModalProps {
  user: any;
  onClose: () => void;
  onApprove: (userId: string) => void;
  onDeny: (userId: string) => void;
  onUpdate: () => void;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ user, onClose, onApprove, onDeny, onUpdate }) => {
  const [uploadLimit, setUploadLimit] = useState(user.uploadLimit || 0);
  const [backgroundLimit, setBackgroundLimit] = useState(user.backgroundLimit || 0);
  const [isDisabled, setIsDisabled] = useState(user.isDisabled || false);

  const handleSave = async () => {
    const userRef = doc(db, 'users', user.id);
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
            <Label htmlFor="status" className="text-right">Status</Label>
            <div className="col-span-3">{getStatusBadge(user.status || 'pending')}</div>
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="isDisabled" className="text-right">Inaktivera konto</Label>
            <Input
              id="isDisabled"
              type="checkbox"
              checked={isDisabled}
              onChange={(e) => setIsDisabled(e.target.checked)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            {user.status !== 'approved' && (
              <Button onClick={() => onApprove(user.id)} className="w-full sm:w-auto">
                Godkänn användare
              </Button>
            )}
            {user.status !== 'denied' && (
              <Button onClick={() => onDeny(user.id)} variant="destructive" className="w-full sm:w-auto">
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
