import React from "react";
import { Camera, Image, Palette, CheckCircle } from "lucide-react";

const HowToUse = () => {
  return (
    <section className="container mx-auto py-16 px-4">
      <h2 className="text-3xl font-bold text-center text-blue-800 mb-12">
        Så här använder du verktyget
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <Step
          icon={<Camera className="h-12 w-12" />}
          step="Steg 1"
          title="Ladda upp en bild"
          description="Börja med att ladda upp en bild på din bil i vårt verktyg."
        />
        <Step
          icon={<Image className="h-12 w-12" />}
          step="Steg 2"
          title="Ta bort bakgrund"
          description="Verktyget tar automatiskt bort bakgrunden från din bild."
        />
        <Step
          icon={<Palette className="h-12 w-12" />}
          step="Steg 3"
          title="Välj en bakgrund"
          description="Välj en professionell bakgrund som passar din bild bäst."
        />
        <Step
          icon={<CheckCircle className="h-12 w-12" />}
          step="Steg 4"
          title="Förbättra och spara"
          description="Förbättra kvaliteten och spara bilden för att använda direkt."
        />
      </div>
    </section>
  );
};

interface StepProps {
  icon: React.ReactNode;
  step: string;
  title: string;
  description: string;
}

const Step: React.FC<StepProps> = ({ icon, step, title, description }) => (
  <div className="flex flex-col items-center text-center p-6 relative text-blue-700">
    <div className="flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
      {icon}
    </div>
    <span className="text-sm font-semibold text-blue-500 mb-1">{step}</span>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default HowToUse;
