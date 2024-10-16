import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRegistrationLink } from "@/lib/firebase";
import { Label } from "@radix-ui/react-label";

const RegistrationLinkCreator = () => {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");

  const handleCreateLink = async () => {
    const link = await createRegistrationLink(email, companyName);
    setRegistrationLink(link);
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Skapa Registreringslänk</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          type="email"
          placeholder="Kundens e-postadress"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full"
        />
        <Input
          type="text"
          placeholder="Företagsnamn"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="w-full"
        />
        <Button onClick={handleCreateLink} className="w-full">
          Skapa länk
        </Button>
      </div>
      {registrationLink && (
        <div className="mt-4">
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Registreringslänk:
          </Label>
          <Input value={registrationLink} readOnly className="w-full" />
        </div>
      )}
    </div>
  );
};

export default RegistrationLinkCreator;
