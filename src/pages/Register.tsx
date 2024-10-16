import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { validateRegistrationLink, signUp } from '@/lib/firebase';

const Register = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const validateLink = async () => {
      if (linkId) {
        const validEmail = await validateRegistrationLink(linkId);
        if (validEmail) {
          setEmail(validEmail);
        } else {
          setError('Ogiltig eller använd registreringslänk.');
        }
      }
    };
    validateLink();
  }, [linkId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password, 'customer', {
        companyName,
        contactPerson,
        phoneNumber
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Registreringen misslyckades. Försök igen.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Registrera dig</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="E-postadress"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            readOnly={!!linkId}
          />
          <Input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Företagsnamn"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Kontaktperson"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            required
          />
          <Input
            type="tel"
            placeholder="Telefonnummer"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Registrera</Button>
        </form>
      </div>
    </div>
  );
};

export default Register;