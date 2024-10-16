import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ImageUploader from "@/components/ImageUploader/ImageUploader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

const FolderPage = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const [folderName, setFolderName] = useState("");
  const [carDetails, setCarDetails] = useState({
    brand: "",
    model: "",
    year: "",
    color: "",
  });
  const [uploadLimit, setUploadLimit] = useState(0);

  useEffect(() => {
    const fetchFolderDetails = async () => {
      if (folderId) {
        const folderRef = doc(db, "carFolders", folderId);
        const folderSnap = await getDoc(folderRef);
        if (folderSnap.exists()) {
          const data = folderSnap.data();
          setFolderName(data.name);
          setCarDetails({
            brand: data.brand || "",
            model: data.model || "",
            year: data.year || "",
            color: data.color || "",
          });
        }
      }
    };

    const fetchUserUploadLimit = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUploadLimit(userSnap.data().uploadLimit || 0);
        }
      }
    };

    fetchFolderDetails();
    fetchUserUploadLimit();
  }, [folderId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "folderName") {
      setFolderName(value);
    } else {
      setCarDetails((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (folderId) {
      const folderRef = doc(db, "carFolders", folderId);
      await updateDoc(folderRef, {
        name: folderName,
        ...carDetails,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto mt-8 p-4">
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <Label htmlFor="folderName">Mappnamn</Label>
            <Input
              id="folderName"
              name="folderName"
              value={folderName}
              onChange={handleInputChange}
              placeholder="Ange mappnamn"
            />
          </div>
          <Button type="submit">Spara ändringar</Button>
        </form>

        <Accordion type="single" collapsible className="mb-8">
          <AccordionItem value="carDetails">
            <AccordionTrigger>Bildetaljer</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="brand">Bil</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={carDetails.brand}
                    onChange={handleInputChange}
                    placeholder="T.ex. Volvo"
                  />
                </div>
                <div>
                  <Label htmlFor="model">Modell</Label>
                  <Input
                    id="model"
                    name="model"
                    value={carDetails.model}
                    onChange={handleInputChange}
                    placeholder="T.ex. XC90"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Årtal</Label>
                  <Input
                    id="year"
                    name="year"
                    value={carDetails.year}
                    onChange={handleInputChange}
                    placeholder="T.ex. 2023"
                  />
                </div>
                <div>
                  <Label htmlFor="color">Färg</Label>
                  <Input
                    id="color"
                    name="color"
                    value={carDetails.color}
                    onChange={handleInputChange}
                    placeholder="T.ex. Svart"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <h2 className="text-2xl font-bold mb-4">Ladda upp bilder</h2>
        <ImageUploader folderId={folderId} uploadLimit={uploadLimit} />
      </main>
    </div>
  );
};

export default FolderPage;
