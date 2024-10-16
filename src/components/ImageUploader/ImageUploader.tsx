import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { getUserProcessedImages } from '@/utils/firebaseStorage';
import ImageModal from '../ImageModal';
import ProcessedImagesList from '../ProcessedImagesList';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import ImageDropzone from './ImageDropzone';
import BackgroundSelector from './BackgroundSelector';
import { toast } from 'sonner';
import { processImage } from '@/utils/imageProcessing';
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  folderId: string | undefined;
  uploadLimit: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ folderId, uploadLimit }) => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [remainingUploads, setRemainingUploads] = useState(uploadLimit);
  const [backgrounds, setBackgrounds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSavedImages();
    updateRemainingUploads();
    fetchBackgrounds();
  }, [folderId]);

  const fetchSavedImages = async () => {
    if (!folderId) return;
    try {
      const images = await getUserProcessedImages(folderId);
      setSavedImages(images);
    } catch (error) {
      console.error('Fel vid hämtning av sparade bilder:', error);
      toast.error('Kunde inte hämta sparade bilder. Försök igen senare.');
    }
  };

  const updateRemainingUploads = async () => {
    const user = auth.currentUser;
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setRemainingUploads(userData.uploadLimit - (userData.uploadCount || 0));
      }
    }
  };

  const fetchBackgrounds = async () => {
    // Här skulle du hämta bakgrunder från Firebase Storage eller din API
    // För nu använder vi dummy-data
    setBackgrounds(['Showroom', 'Utomhus', 'Studio']);
  };

  const handleImageDrop = (file: File) => {
    setUploadedImage(file);
  };

  const handleSelectBackground = (background: string) => {
    setSelectedBackground(background);
  };

  const handleProcessImage = async () => {
    if (uploadedImage && folderId && remainingUploads > 0 && selectedBackground) {
      setIsLoading(true);
      try {
        const processedImageUrl = await processImage(uploadedImage, selectedBackground, folderId);
        if (processedImageUrl) {
          setSavedImages(prevImages => [...prevImages, processedImageUrl]);
          
          const user = auth.currentUser;
          if (user) {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              const userData = userSnap.data();
              await updateDoc(userRef, {
                uploadCount: (userData.uploadCount || 0) + 1
              });
              setRemainingUploads(prev => prev - 1);
            }
          }
          toast.success('Bilden har bearbetats och sparats!');
        }
      } catch (error) {
        console.error('Fel vid bildbehandling:', error);
        toast.error('Ett fel uppstod vid bildbehandling. Försök igen.');
      } finally {
        setIsLoading(false);
        setUploadedImage(null);
        setSelectedBackground(null);
      }
    } else if (remainingUploads <= 0) {
      toast.error("Du har nått din uppladdningsgräns. Kontakta administratören för att öka din gräns.");
    } else if (!selectedBackground) {
      toast.error("Välj en bakgrund innan du bearbetar bilden.");
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <ImageDropzone onImageDrop={handleImageDrop} />

      {uploadedImage && (
        <div className="space-y-4">
          <img src={URL.createObjectURL(uploadedImage)} alt="Uppladdad" className="mx-auto max-h-64 object-cover" />
          <BackgroundSelector
            backgrounds={backgrounds}
            selectedBackground={selectedBackground}
            onSelectBackground={handleSelectBackground}
          />
          <Button
            onClick={handleProcessImage}
            disabled={isLoading || remainingUploads <= 0 || !selectedBackground}
            className="w-full"
          >
            {isLoading ? 'Bearbetar...' : 'Ta bort bakgrund'}
          </Button>
          <p>Återstående uppladdningar: {remainingUploads}</p>
        </div>
      )}

      <ProcessedImagesList images={savedImages} onImageClick={handleImageClick} />

      {isModalOpen && (
        <ImageModal
          imageUrl={selectedImageUrl}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ImageUploader;