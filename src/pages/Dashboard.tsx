import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from '@/components/Navigation';
import { Plus, Image, Palette } from 'lucide-react';
import CarFolderList from '@/components/CarFolderList';

const Dashboard = () => {
  const navigate = useNavigate();

  // TODO: Replace these with actual data from your state management or API
  const remainingImages = 50;
  const usedBackgrounds = 10;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2" />
                Skapa ny
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/create-folder')}>Skapa ny mapp</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="mr-2" />
                Antal bilder kvar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{remainingImages}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="mr-2" />
                Antal bakgrunder använda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{usedBackgrounds}</p>
            </CardContent>
          </Card>
        </div>
        <CarFolderList />
      </main>
    </div>
  );
};

export default Dashboard;