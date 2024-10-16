import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  availableBackgrounds: string[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ availableBackgrounds }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState<string | null>(null);

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
    
    // Resize the image before sending to the API
    const resizedImage = await resizeImage(file, 800, 600);
    formData.append("image_file", resizedImage, "resized_image.png");
    
    if (selectedBackground) {
      formData.append("bg_image_url", selectedBackground);
    }

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
      setProcessedImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Error removing background:", error);
      alert("Error processing image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessImage = () => {
    if (uploadedImage) {
      fetch(uploadedImage)
        .then(res => res.blob())
        .then(blob => removeBg(blob as File));
    }
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
          <p>Drop the image here ...</p>
        ) : (
          <p>Drag 'n' drop an image here, or click to select an image</p>
        )}
      </div>

      {uploadedImage && (
        <div className="space-y-4">
          <img src={uploadedImage} alt="Uploaded" className="mx-auto max-h-64 object-cover" />
          <div className="grid grid-cols-4 gap-4">
            {availableBackgrounds.map((bg, index) => (
              <div
                key={index}
                className={`cursor-pointer border-2 ${
                  selectedBackground === bg ? 'border-blue-500' : 'border-transparent'
                }`}
                onClick={() => setSelectedBackground(bg)}
              >
                <img src={bg} alt={`Background ${index + 1}`} className="w-full h-24 object-cover" />
              </div>
            ))}
          </div>
          <Button onClick={handleProcessImage} disabled={isLoading || !selectedBackground}>
            {isLoading ? 'Processing...' : 'Remove Background'}
          </Button>
        </div>
      )}

      {processedImage && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Processed Image:</h3>
          <img src={processedImage} alt="Processed" className="mx-auto max-h-64 object-cover" />
        </div>
      )}
    </div>
  );

};

export default ImageUploader;