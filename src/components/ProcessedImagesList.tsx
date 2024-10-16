import React from 'react';

interface ProcessedImagesListProps {
  images: string[];
  onImageClick: (imageUrl: string) => void;
}

const ProcessedImagesList: React.FC<ProcessedImagesListProps> = ({ images, onImageClick }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Your Processed Images:</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Processed ${index + 1}`}
            className="w-full h-40 object-cover cursor-pointer"
            onClick={() => onImageClick(image)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProcessedImagesList;