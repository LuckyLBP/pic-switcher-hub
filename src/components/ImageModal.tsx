import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bearbetad Bild</DialogTitle>
          <DialogDescription>
            Visa din bearbetade bild och spara den om du vill.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <img src={imageUrl} alt="Bearbetad" className="w-full h-auto" />
        </div>
        <div className="mt-4 text-center">
          <p>Högerklicka för att spara!</p>
          <div className="flex justify-center mt-2">
            <span className="arrow-down"></span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
