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
          >
            {background}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BackgroundSelector;