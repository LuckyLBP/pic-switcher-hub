import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import LoginForm from '@/components/LoginForm';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

const Index = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-3xl font-bold">Bilhandlarens Bildverktyg</h1>
      </header>
      <main className="container mx-auto mt-8 p-4">
        {user ? (
          <div className="text-center">
            <h2 className="text-2xl mb-4">Välkommen, {user.email}!</h2>
            <Button onClick={() => navigate('/dashboard')}>Gå till Dashboard</Button>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl mb-4 text-center">Logga in för att fortsätta</h2>
            <LoginForm />
          </div>
        )}
        <section className="mt-12">
          <h2 className="text-2xl mb-4">Om vår tjänst</h2>
          <p className="mb-4">
            Vårt avancerade bildverktyg hjälper bilhandlare att enkelt förbättra sina produktbilder. 
            Med vår tjänst kan du:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Ladda upp bilder på bilar</li>
            <li>Automatiskt ta bort bakgrunden</li>
            <li>Välja nya, professionella bakgrunder</li>
            <li>Förbättra bildens kvalitet</li>
          </ul>
          <p>
            Skapa fantastiska bilder som får dina bilar att sticka ut på marknaden!
          </p>
        </section>
      </main>
    </div>
  );
};

export default Index;