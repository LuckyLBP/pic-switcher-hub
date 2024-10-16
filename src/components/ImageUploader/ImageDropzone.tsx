import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageDropzoneProps {
  onImageDrop: (file: File) => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onImageDrop }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageDrop(acceptedFiles[0]);
    }
  }, [onImageDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
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
  );
};

export default ImageDropzone;