import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import About from "@/components/IndexPage/About";
import SiteFooter from "@/components/IndexPage/Footer";
import Hero from "@/components/IndexPage/Hero";
import Contact from "@/components/IndexPage/Contact";
import HowToUse from "@/components/IndexPage/HowToUse";

const Index = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white text-gray-800 shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-semibold tracking-wide text-blue-600">
            Bilappen 🚗✨
          </h1>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Button
              variant="outline"
              onClick={scrollToContact}
              className="px-3 py-1 md:px-4 md:py-2 text-sm md:text-base bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Kontakta oss
            </Button>
            {user ? (
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="px-3 py-1 md:px-4 md:py-2 text-sm md:text-base text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white transition"
              >
                Gå till Dashboard
              </Button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-blue-500 text-sm md:text-base hover:underline"
              >
                Logga in
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <Hero />
        <HowToUse />
        <About />
        <section id="contact">
          <Contact />
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
