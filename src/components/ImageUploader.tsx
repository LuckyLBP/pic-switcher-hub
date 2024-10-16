import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { auth, db } from '@/lib/firebase';
import { saveProcessedImage, getUserProcessedImages } from '@/utils/firebaseStorage';
import ImageModal from './ImageModal';
import ProcessedImagesList from './ProcessedImagesList';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

interface ImageUploaderProps {
  folderId: string | undefined;
  uploadLimit: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ folderId, uploadLimit }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [remainingUploads, setRemainingUploads] = useState(uploadLimit);

  useEffect(() => {
    fetchSavedImages();
    updateRemainingUploads();
  }, [folderId]);

  const fetchSavedImages = async () => {
    try {
      const images = await getUserProcessedImages(folderId || '');
      setSavedImages(images);
    } catch (error) {
      console.error('Error fetching saved images:', error);
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setUploadedImage(URL.createObjectURL(file));
    setProcessedImage(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(blob as Blob);
          }, file.type);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeBg = async (file: File) => {
    const formData = new FormData();
    formData.append("size", "auto");
    
    const resizedImage = await resizeImage(file, 800, 600);
    formData.append("image_file", resizedImage, "resized_image.png");
    
    if (selectedBackground) {
      formData.append("bg_image_url", selectedBackground);
    }

    formData.append("add_shadow", "true");

    try {
      setIsLoading(true);
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
      const savedImageUrl = await saveProcessedImage(blob, folderId || '');
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
    } catch (error) {
      console.error("Error removing background:", error);
      alert("Error processing image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessImage = () => {
    if (uploadedImage && folderId && remainingUploads > 0) {
      fetch(uploadedImage)
        .then(res => res.blob())
        .then(blob => removeBg(blob as File));
    } else if (remainingUploads <= 0) {
      alert("Du har nått din uppladdningsgräns. Kontakta administratören för att öka din gräns.");
    }
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed p-8 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Släpp bilden här ...</p>
        ) : (
          <p>Dra och släpp en bild här, eller klicka för att välja en bild</p>
        )}
      </div>

      {uploadedImage && (
        <div className="space-y-4">
          <img src={uploadedImage} alt="Uppladdad" className="mx-auto max-h-64 object-cover" />
          <Button onClick={handleProcessImage} disabled={isLoading || remainingUploads <= 0}>
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