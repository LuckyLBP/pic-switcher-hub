import React from 'react';
import Navigation from '@/components/Navigation';
import CarFolderList from '@/components/CarFolderList';

const Gallery = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6">Galleri</h1>
        <CarFolderList />
      </main>
    </div>
  );
};

export default Gallery;