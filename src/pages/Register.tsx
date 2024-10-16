import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateRegistrationLink, signUp } from "@/lib/firebase";
import { toast } from "sonner";

const Register = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateLink = async () => {
      if (linkId) {
        try {
          console.log("Validating link:", linkId);
          setIsLoading(true);
          const validData = await validateRegistrationLink(linkId);
          console.log("Validation result:", validData);
          if (validData) {
            setEmail(validData.email);
            setCompanyName(validData.companyName);
            console.log("Email set to:", validData.email);
          } else {
            setError("Ogiltig eller använd registreringslänk.");
          }
        } catch (err) {
          console.error("Error validating link:", err);
          setError("Ett fel uppstod vid validering av registreringslänken.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    validateLink();
  }, [linkId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password || !companyName || !contactPerson || !phoneNumber) {
      setError("Vänligen fyll i alla obligatoriska fält.");
      return;
    }
    try {
      await signUp(email, password, "customer", {
        companyName,
        contactPerson,
        phoneNumber,
        logo,
        isApproved: false,
        uploadLimit: 0,
        backgroundLimit: 0,
        selectedBackgrounds: [],
        linkId: linkId,
      });
      toast.success("Registrering lyckades!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Error in signUp function:", err);
      setError(err.message || "Registreringen misslyckades. Försök igen.");
    }
  };

  if (isLoading) {
    return <div>Laddar...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Registrera dig</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">E-postadress</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              readOnly={!!linkId}
            />
          </div>
          <div>
            <Label htmlFor="password">Lösenord</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="companyName">Företagsnamn</Label>
            <Input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="contactPerson">Kontaktperson</Label>
            <Input
              id="contactPerson"
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Telefonnummer</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Registrera
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
