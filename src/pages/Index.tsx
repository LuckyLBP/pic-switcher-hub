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
import { ChatBubbleLeftIcon, ArrowRightIcon, UserIcon } from "@heroicons/react/24/outline";

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
      <header className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg p-4 sticky top-0 z-10 transition duration-300 ease-in-out">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-semibold tracking-wide flex items-center space-x-2">
            <img src="/public/assets/bilappen.png" className="max-w-36" alt="logo" />
          </h1>
          <div className="flex items-center space-x-3 md:space-x-6">
            <Button
              variant="outline"
              onClick={scrollToContact}
              className="flex items-center space-x-2 px-3 py-1 md:px-4 md:py-2 text-sm md:text-base bg-white text-blue-600 font-medium rounded-full hover:bg-blue-500 hover:text-white transition-all duration-300"
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span>Kontakta oss</span>
            </Button>
            {user ? (
              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="flex items-center space-x-2 px-3 py-1 md:px-4 md:py-2 text-sm md:text-base text-white border-white rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                <span>Gå till Dashboard</span>
                <ArrowRightIcon className="h-5 w-5" />
              </Button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center space-x-2 text-white text-sm md:text-base font-medium hover:underline"
              >
                <UserIcon className="h-5 w-5" />
                <span>Logga in</span>
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
