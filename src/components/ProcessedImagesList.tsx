import React from 'react';

interface ProcessedImagesListProps {
  images: string[];
  onImageClick: (imageUrl: string) => void;
}

const ProcessedImagesList: React.FC<ProcessedImagesListProps> = ({ images, onImageClick }) => {
  if (images.length === 0) {
    return <p>Inga bearbetade bilder än.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Bearbetade bilder</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`Bearbetad bild ${index + 1}`}
            className="w-full h-40 object-cover cursor-pointer"
            onClick={() => onImageClick(imageUrl)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProcessedImagesList;