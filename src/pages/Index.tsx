import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Camera, Image, Palette } from 'lucide-react';

const Index = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="bg-blue-600 text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">Bilhandlarens Bildverktyg</h1>
          {user && (
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Gå till Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </header>
      <main className="container mx-auto mt-12 p-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-blue-800">Förvandla dina bilbilder</h2>
            <p className="text-xl mb-8 text-gray-700">
              Vårt avancerade bildverktyg hjälper bilhandlare att enkelt förbättra sina produktbilder och sticka ut på marknaden.
            </p>
            {!user && (
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Logga in för att börja</CardTitle>
                </CardHeader>
                <CardContent>
                  <LoginForm />
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Har du inget konto?</p>
                    <Button variant="link" onClick={() => navigate('/register')}>
                      Registrera dig här
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Camera className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Ladda upp bilder</CardTitle>
              </CardHeader>
              <CardContent>
                Enkelt gränssnitt för att ladda upp dina bilbilder.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Image className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Ta bort bakgrund</CardTitle>
              </CardHeader>
              <CardContent>
                Automatisk borttagning av bakgrunden från dina bilder.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Palette className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Välj bakgrund</CardTitle>
              </CardHeader>
              <CardContent>
                Stort urval av professionella bakgrunder att välja mellan.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Image className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Förbättra kvalitet</CardTitle>
              </CardHeader>
              <CardContent>
                Automatisk förbättring av bildkvaliteten för bästa resultat.
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;