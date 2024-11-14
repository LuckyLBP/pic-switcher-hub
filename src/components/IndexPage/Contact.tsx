import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, User, MessageCircle, Building } from "lucide-react";

const Contact = () => {
  const [formState, setFormState] = useState({ name: "", company: "",email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission logic
    console.log("Form submitted:", formState);
  };

  return (
    <section className="container mx-auto py-16 px-4">
      <h2 className="text-4xl font-extrabold text-center text-blue-800 mb-6">
        Hör av dig! 💬
      </h2>
      <p className="text-center text-gray-600 text-lg mb-12">
        Har du frågor, feedback, eller <strong>vill ha detta verktyg</strong>? Vi ser fram emot att höra från dig!
      </p>
      <div className="max-w-lg mx-auto bg-blue-50 p-8 rounded-xl shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <Input
              name="name"
              placeholder="Ditt namn"
              value={formState.name}
              onChange={handleChange}
              required
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <Input
              name="company"
              placeholder="Ditt företag"
              value={formState.company}
              onChange={handleChange}
              required
              className="pl-10"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <Input
              name="email"
              type="email"
              placeholder="Din e-post"
              value={formState.email}
              onChange={handleChange}
              required
              className="pl-10"
            />
          </div>
          <div className="relative">
            <MessageCircle className="absolute left-3 top-1/4 transform -translate-y-1/2 text-blue-500" />
            <Textarea
              name="message"
              placeholder="Ditt meddelande"
              value={formState.message}
              onChange={handleChange}
              required
              className="pl-10 py-3"
            />
          </div>
          <Button
            variant="default"
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Skicka meddelande
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
