import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ImageUploader from '@/components/ImageUploader';

const FolderPage = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const [carDetails, setCarDetails] = useState({
    brand: '',
    model: '',
    year: '',
    color: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCarDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Car details:', carDetails);
    // TODO: Implement saving car details to Firestore
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6">Bildetaljer</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <Label htmlFor="brand">Bil</Label>
            <Input
              id="brand"
              name="brand"
              value={carDetails.brand}
              onChange={handleInputChange}
              placeholder="T.ex. Volvo"
            />
          </div>
          <div>
            <Label htmlFor="model">Modell</Label>
            <Input
              id="model"
              name="model"
              value={carDetails.model}
              onChange={handleInputChange}
              placeholder="T.ex. XC90"
            />
          </div>
          <div>
            <Label htmlFor="year">Årtal</Label>
            <Input
              id="year"
              name="year"
              value={carDetails.year}
              onChange={handleInputChange}
              placeholder="T.ex. 2023"
            />
          </div>
          <div>
            <Label htmlFor="color">Färg</Label>
            <Input
              id="color"
              name="color"
              value={carDetails.color}
              onChange={handleInputChange}
              placeholder="T.ex. Svart"
            />
          </div>
          <Button type="submit">Spara bildetaljer</Button>
        </form>

        <h2 className="text-2xl font-bold mb-4">Ladda upp bilder</h2>
        <ImageUploader folderId={folderId} />
      </main>
    </div>
  );
};

export default FolderPage;