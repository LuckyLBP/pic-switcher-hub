import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Camera, Image, Palette } from "lucide-react";

const Index = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <header className="bg-blue-600 text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl text-white font-bold tracking-wide">
            Bilappen
          </h1>
          {user && (
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Gå till Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </header>
      <main className="container mx-auto mt-12 p-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-blue-800 leading-tight">
              Förvandla dina bilbilder med enkelhet
            </h2>
            <p className="text-lg mb-8 text-gray-700 leading-relaxed">
              Vårt avancerade bildverktyg hjälper bilhandlare att snabbt
              förbättra sina produktbilder och sticka ut på marknaden med
              högkvalitativa visuella presentationer.
            </p>
            {!user && (
              <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Logga in för att börja
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LoginForm />
                </CardContent>
              </Card>
            )}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <LandingFeature
              icon={<Camera className="h-8 w-8 text-blue-500 mb-2" />}
              title="Ladda upp bilder"
              description="Enkelt gränssnitt för att ladda upp dina bilbilder."
            />
            <LandingFeature
              icon={<Image className="h-8 w-8 text-blue-500 mb-2" />}
              title="Ta bort bakgrund"
              description="Automatisk borttagning av bakgrunden från dina bilder."
            />
            <LandingFeature
              icon={<Palette className="h-8 w-8 text-blue-500 mb-2" />}
              title="Välj bakgrund"
              description="Stort urval av professionella bakgrunder att välja mellan."
            />
            <LandingFeature
              icon={<Image className="h-8 w-8 text-blue-500 mb-2" />}
              title="Förbättra kvalitet"
              description="Automatisk förbättring av bildkvaliteten för bästa resultat."
            />
          </div>
        </div>
      </main>
    </div>
  );
};

interface LandingFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const LandingFeature: React.FC<LandingFeatureProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <Card className="transform hover:scale-105 transition-transform duration-300 ease-in-out shadow-md">
      <CardHeader>
        {icon}
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Index;
