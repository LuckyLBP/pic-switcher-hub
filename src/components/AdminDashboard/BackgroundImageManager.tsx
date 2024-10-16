import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';

const BackgroundImageManager = () => {
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);

  const fetchBackgroundImages = async () => {
    const listRef = ref(storage, 'backgrounds');
    const res = await listAll(listRef);
    const urls = await Promise.all(res.items.map(itemRef => getDownloadURL(itemRef)));
    setBackgroundImages(urls);
  };

  const handleBackgroundUpload = async () => {
    if (backgroundImage) {
      const storageRef = ref(storage, `backgrounds/${backgroundImage.name}`);
      await uploadBytes(storageRef, backgroundImage);
      await fetchBackgroundImages();
      setBackgroundImage(null);
    }
  };

  const handleBackgroundDelete = async (imageUrl: string) => {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    await fetchBackgroundImages();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Ladda upp bakgrundsbild</h2>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setBackgroundImage(e.target.files?.[0] || null)}
      />
      <Button onClick={handleBackgroundUpload} disabled={!backgroundImage}>
        Ladda upp bakgrund
      </Button>

      <h2 className="text-2xl font-bold">Bakgrundsbilder</h2>
      <div className="grid grid-cols-3 gap-4">
        {backgroundImages.map((imageUrl, index) => (
          <div key={index} className="relative">
            <img src={imageUrl} alt={`Background ${index + 1}`} className="w-full h-40 object-cover" />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => handleBackgroundDelete(imageUrl)}
            >
              Ta bort
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundImageManager;