import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LimitsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (uploadLimit: number, backgroundLimit: number) => void;
  currentUploadLimit: number;
  currentBackgroundLimit: number;
}

const LimitsModal: React.FC<LimitsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentUploadLimit,
  currentBackgroundLimit
}) => {
  const [uploadLimit, setUploadLimit] = useState(currentUploadLimit);
  const [backgroundLimit, setBackgroundLimit] = useState(currentBackgroundLimit);

  const handleSave = () => {
    onSave(uploadLimit, backgroundLimit);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ändra gränser</DialogTitle>
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
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Spara ändringar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LimitsModal;