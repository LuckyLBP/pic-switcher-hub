import React from "react";

interface ProcessedImagesListProps {
  images: string[];
  onImageClick: (imageUrl: string) => void;
}

const ProcessedImagesList: React.FC<ProcessedImagesListProps> = ({
  images,
  onImageClick,
}) => {
  if (images.length === 0) {
    return (
      <p className="text-center text-gray-500">Inga bearbetade bilder än.</p>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Bearbetade bilder
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((imageUrl, index) => (
          <div
            key={index}
            className="relative group cursor-pointer"
            onClick={() => onImageClick(imageUrl)}
          >
            <img
              src={imageUrl}
              alt={`Bearbetad bild ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg transition-transform transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <button className="text-white text-lg font-semibold">
                Visa bild
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessedImagesList;
