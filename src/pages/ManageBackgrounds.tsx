import React, { useState, useEffect } from "react";
import { ref, listAll, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

const ManageBackgrounds = () => {
  const [backgrounds, setBackgrounds] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchBackgrounds = async () => {
      const storageRef = ref(storage, "backgrounds/");
      const result = await listAll(storageRef);
      const urls = await Promise.all(result.items.map(item => getDownloadURL(item)));
      setBackgrounds(urls);
    };

    fetchBackgrounds();
  }, []);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setUploading(true);

    const file = event.target.files[0];
    const storageRef = ref(storage, `backgrounds/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setBackgrounds(prev => [...prev, url]);
    setUploading(false);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Hantera Bakgrunder</h1>
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        className="mb-4"
      />
      <div className="grid grid-cols-3 gap-4">
        {backgrounds.map((bg, index) => (
          <img key={index} src={bg} alt="Background" className="rounded shadow" />
        ))}
      </div>
    </div>
  );
};

export default ManageBackgrounds;
