import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/components/LoginForm";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

const Hero = () => {
  const [user] = useAuthState(auth);

  return (
    <section className="bg-gradient-to-b from-blue-100 to-white py-16 px-4">
      <div className="container mx-auto flex flex-col items-center text-center space-y-8 md:space-y-12">
        <div className="max-w-2xl">
          <h2 className="text-5xl font-bold mb-4 leading-tight text-gray-900">
            Förvandla dina bilbilder med AI
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Ta bild på din bil och ladda upp den i vårt verktyg. Vi tar bort
            bakgrunden, förbättrar kvaliteten på bilden, och erbjuder ett urval av bakgrunder för att få dina bilder att sticka ut.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <FeatureCard
            title="Automatisk Bakgrundsborttagning"
            description="Ladda upp en bild så tar vi bort bakgrunden automatiskt."
            imageSrc="/public/assets/remove-background.png"
          />
          <FeatureCard
            title="Förbättra Bildkvalitet"
            description="Använd AI för att automatiskt förbättra bildens upplösning och skärpa."
            imageSrc="/public/assets/improve-quality.png"
          />
          <FeatureCard
            title="Anpassade Bakgrunder"
            description="Välj från ett urval av professionella bakgrunder som passar ditt varumärke."
            imageSrc="/public/assets/select-background.png"
          />
        </div>
      </div>
    </section>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, imageSrc }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden">
    <img src={imageSrc} alt={title} className="w-full h-40 object-cover" />
    <CardContent className="p-6">
      <CardTitle className="text-2xl font-semibold mb-2 text-gray-800">{title}</CardTitle>
      <p className="text-gray-600 text-sm">{description}</p>
    </CardContent>
  </Card>
);

export default Hero;
