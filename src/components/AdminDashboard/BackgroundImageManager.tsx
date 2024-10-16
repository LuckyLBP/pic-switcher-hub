import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { storage } from "@/lib/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { Trash } from "lucide-react";

const BackgroundImageManager = () => {
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBackgroundImages();
  }, []);

  const fetchBackgroundImages = async () => {
    const listRef = ref(storage, "backgrounds");
    const res = await listAll(listRef);
    const urls = await Promise.all(
      res.items.map((itemRef) => getDownloadURL(itemRef))
    );
    setBackgroundImages(urls);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    for (const file of acceptedFiles) {
      const storageRef = ref(storage, `backgrounds/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null,
          (error) => {
            console.error("Upload error:", error);
            reject(error);
          },
          async () => {
            resolve();
          }
        );
      });
    }
    await fetchBackgroundImages();
    setUploading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  const handleBackgroundDelete = async (imageUrl: string) => {
    try {
      const imagePath = decodeURIComponent(
        imageUrl.split("?")[0].split("/").slice(-1)[0].replace("%2F", "/")
      );
      const imageRef = ref(storage, `backgrounds/${imagePath}`);
      await deleteObject(imageRef);
      await fetchBackgroundImages();
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Hantera Bakgrundsbilder</h2>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer ${
          isDragActive
            ? "border-blue-400 bg-blue-50"
            : "border-gray-300 bg-gray-100"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-400">Släpp filerna här...</p>
        ) : (
          <p className="text-gray-600">
            Dra och släpp bilder här, eller klicka för att välja filer
          </p>
        )}
      </div>

      {uploading && (
        <div className="mt-4 text-center text-blue-600">Laddar upp...</div>
      )}

      <h2 className="text-2xl font-bold my-4">Bakgrundsbilder</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {backgroundImages.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <img
              src={imageUrl}
              alt={`Background ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg shadow"
            />
            <button
              onClick={() => handleBackgroundDelete(imageUrl)}
              className="absolute top-2 right-2 bg-black text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundImageManager;
