import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here (e.g., send to email or backend)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          name="name"
          placeholder="Ditt namn"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Input
          type="email"
          name="email"
          placeholder="Din e-postadress"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Textarea
          name="message"
          placeholder="Ditt meddelande"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
        />
      </div>
      <Button type="submit" className="w-full">
        Skicka Meddelande
      </Button>
    </form>
  );
};

export default ContactForm;
