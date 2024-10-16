import React from 'react';
import { Button } from "@/components/ui/button";

interface BackgroundSelectorProps {
  backgrounds: string[];
  selectedBackground: string | null;
  onSelectBackground: (background: string) => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({ backgrounds, selectedBackground, onSelectBackground }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Välj bakgrund:</h3>
      <div className="grid grid-cols-3 gap-4">
        {backgrounds.map((background) => (
          <Button
            key={background}
            onClick={() => onSelectBackground(background)}
            variant={selectedBackground === background ? "default" : "outline"}
            className="h-24 p-0 overflow-hidden"
          >
            {background === 'Ta bort bakgrund' ? (
              <span className="text-sm">Ta bort bakgrund</span>
            ) : (
              <img src={background} alt="Bakgrund" className="w-full h-full object-cover" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BackgroundSelector;