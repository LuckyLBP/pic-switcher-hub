import React from "react";

const SiteFooter = () => {
  return (
    <footer className="bg-blue-600 text-white py-6 mt-8">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-center md:text-left">
          &copy; {new Date().getFullYear()} Bilappen. Alla rättigheter förbehållna.
        </p>
        <nav className="flex space-x-4 mt-4 md:mt-0">
          <a
            href="#"
            className="text-white hover:underline"
            aria-label="Integritetspolicy"
          >
            Integritetspolicy
          </a>
          <a
            href="#"
            className="text-white hover:underline"
            aria-label="Användarvillkor"
          >
            Användarvillkor
          </a>
          <a
            href="#"
            className="text-white hover:underline"
            aria-label="Kontakt"
          >
            Kontakt
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default SiteFooter;
