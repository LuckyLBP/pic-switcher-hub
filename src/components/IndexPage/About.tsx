import React from "react";
import { Users, TrendingUp, CheckCircle } from "lucide-react";

const About = () => {
  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="container mx-auto text-center md:flex md:items-center md:justify-center space-y-12 md:space-y-0">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl font-extrabold text-blue-800 mb-4">
            Om Oss 🚗✨
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Vi är ett gäng teknikentusiaster som brinner för bildredigering och AI! Vårt mål? Att göra dina bilbilder magiska. Med vår teknik kan bilhandlare enkelt sticka ut i mängden och ge sina bilar en ny glans.
          </p>
          <div className="flex justify-center md:justify-center space-x-4 pt-4">
            <FunFact
              icon={<Users className="h-8 w-8 text-blue-600" />}
              number="5+"
              label="Experter i teamet"
            />
            <FunFact
              icon={<TrendingUp className="h-8 w-8 text-green-600" />}
              number="10x"
              label="Snabbare arbetsflöde"
            />
            <FunFact
              icon={<CheckCircle className="h-8 w-8 text-yellow-500" />}
              number="100%"
              label="Kundnöjdhet"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

interface FunFactProps {
  icon: React.ReactNode;
  number: string;
  label: string;
}

const FunFact: React.FC<FunFactProps> = ({ icon, number, label }) => (
  <div className="flex flex-col items-center text-center">
    <div className="flex items-center justify-center mb-2">{icon}</div>
    <h3 className="text-2xl font-bold text-gray-800">{number}</h3>
    <p className="text-gray-600 text-sm">{label}</p>
  </div>
);

export default About;
