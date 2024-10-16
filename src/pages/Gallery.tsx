import React from 'react';
import Navigation from '@/components/Navigation';

const Gallery = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-4">Galleri</h1>
        <p>Här kommer du snart att kunna se och hantera dina bilder.</p>
      </main>
    </div>
  );
};

export default Gallery;