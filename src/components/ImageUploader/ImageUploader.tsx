import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { auth, db } from '@/lib/firebase';
import { saveProcessedImage, getUserProcessedImages } from '@/utils/firebaseStorage';
import ImageModal from '../ImageModal';
import ProcessedImagesList from '../ProcessedImagesList';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import axios from 'axios';
import ImageDropzone from './ImageDropzone';
import BackgroundSelector from './BackgroundSelector';
import { toast } from 'sonner';

interface ImageUploaderProps {
  folderId: string | undefined;
  uploadLimit: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ folderId, uploadLimit }) => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [remainingUploads, setRemainingUploads] = useState(uploadLimit);
  const [backgrounds, setBackgrounds] = useState<string[]>([]);

  useEffect(() => {
    fetchSavedImages();
    updateRemainingUploads();
    fetchBackgrounds();
  }, [folderId]);

  const fetchSavedImages = async () => {
    try {
      const images = await getUserProcessedImages(folderId || '');
      setSavedImages(images);
    } catch (error) {
      console.error('Error fetching saved images:', error);
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
    // Fetch backgrounds from Firestore or your API
    // For now, we'll use dummy data
    setBackgrounds(['Showroom', 'Outdoor', 'Studio']);
  };

  const handleImageDrop = (file: File) => {
    setUploadedImage(file);
    setProcessedImage(null);
  };

  const handleSelectBackground = (background: string) => {
    setSelectedBackground(background);
  };

  const handleProcessImage = async () => {
    if (uploadedImage && folderId && remainingUploads > 0 && selectedBackground) {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append("image_file", uploadedImage);
        formData.append("size", "auto");
        formData.append("bg_image_url", selectedBackground);
        formData.append("add_shadow", "true");

        const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
          headers: { 
            "X-Api-Key": "aay9Lpk91psu5LSvMhMtyoCk",
            "Content-Type": "multipart/form-data"
          },
          responseType: 'arraybuffer'
        });

        const blob = new Blob([response.data], { type: 'image/png' });
        const processedImageUrl = URL.createObjectURL(blob);
        setProcessedImage(processedImageUrl);

        // Save the processed image to Firebase Storage
        const savedImageUrl = await saveProcessedImage(blob, folderId);
        setSavedImages(prevImages => [...prevImages, savedImageUrl]);

        // Update user's upload count
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

        toast.success('Bilden har bearbetats och sparats framgångsrikt!');
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Ett fel uppstod vid bildbehandling. Försök igen.");
      } finally {
        setIsLoading(false);
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
          <Button onClick={handleProcessImage} disabled={isLoading || remainingUploads <= 0 || !selectedBackground}>
            {isLoading ? 'Bearbetar...' : 'Ta bort bakgrund'}
          </Button>
          <p>Återstående uppladdningar: {remainingUploads}</p>
        </div>
      )}

      {processedImage && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Bearbetad bild:</h3>
          <img src={processedImage} alt="Bearbetad" className="mx-auto max-h-64 object-cover" />
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