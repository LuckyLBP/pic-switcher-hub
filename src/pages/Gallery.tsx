import React from "react";
import SidebarNavigation from "@/components/Navigation";
import CarFolderList from "@/components/CarFolderList";

const Gallery = () => {
  return (
    <div className="flex">
      <SidebarNavigation />
      <div className="ml-64 w-full bg-gray-50 min-h-screen">
        <main className="container mx-auto px-4 pt-20 pb-8">
          <h1 className="text-3xl font-bold mb-6">Galleri</h1>
          <CarFolderList />
        </main>
      </div>
    </div>
  );
};

export default Gallery;
