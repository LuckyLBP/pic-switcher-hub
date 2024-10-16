import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRegistrationLink } from '@/lib/firebase';

const RegistrationLinkCreator = () => {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');

  const handleCreateLink = async () => {
    const link = await createRegistrationLink(email, companyName);
    setRegistrationLink(link);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Skapa registreringslänk</h2>
      <div className="flex space-x-2">
        <Input
          type="email"
          placeholder="Kundens e-postadress"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Företagsnamn"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Button onClick={handleCreateLink}>Skapa länk</Button>
      </div>
      {registrationLink && (
        <div className="mt-4">
          <p>Registreringslänk:</p>
          <Input value={registrationLink} readOnly />
        </div>
      )}
    </div>
  );
};

export default RegistrationLinkCreator;