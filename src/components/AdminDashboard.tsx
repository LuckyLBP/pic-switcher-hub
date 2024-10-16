import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createRegistrationLink } from '@/lib/firebase';

const AdminDashboard = () => {
  const [email, setEmail] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');

  const handleCreateLink = async () => {
    const link = await createRegistrationLink(email);
    setRegistrationLink(link);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <div className="flex space-x-2">
        <Input
          type="email"
          placeholder="Kundens e-postadress"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleCreateLink}>Skapa registreringslänk</Button>
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

export default AdminDashboard;