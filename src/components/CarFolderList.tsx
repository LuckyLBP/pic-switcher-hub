import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder } from 'lucide-react';

// TODO: Replace this with actual data from your state management or API
const mockFolders = [
  { id: '1', name: 'Audi A6' },
  { id: '2', name: 'BMW X5' },
  { id: '3', name: 'Volvo XC90' },
];

const CarFolderList = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {mockFolders.map((folder) => (
        <Card 
          key={folder.id} 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate(`/folder/${folder.id}`)}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Folder className="mr-2" />
              {folder.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Click to view images</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CarFolderList;