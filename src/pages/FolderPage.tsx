import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SidebarNavigation from "@/components/Navigation";
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
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { toast } from "sonner";

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
  const navigate = useNavigate();

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
      toast.success("Ändringar sparade.");
    }
  };

  // Handle deleting the folder
  const handleDeleteFolder = async () => {
    if (folderId) {
      try {
        const folderRef = doc(db, "carFolders", folderId);
        await deleteDoc(folderRef);
        toast.success("Mapp borttagen.");
        navigate("/dashboard"); // Redirect to dashboard after deletion
      } catch (error) {
        console.error("Error deleting folder:", error);
        toast.error("Ett fel uppstod vid borttagning av mappen.");
      }
    }
  };

  return (
    <div className="flex">
      <SidebarNavigation />
      <div className="ml-64 w-full bg-gray-50 min-h-screen">
        <main className="container mx-auto px-4 pt-20 pb-8">
          <h1 className="text-3xl font-bold mb-6">{folderName}</h1>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 mb-8 bg-white shadow-lg rounded-lg p-6"
          >
            <div>
              <Label htmlFor="folderName">Mappnamn</Label>
              <Input
                id="folderName"
                name="folderName"
                value={folderName}
                onChange={handleInputChange}
                placeholder="Ange mappnamn"
                className="mt-1"
              />
            </div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="carDetails">
                <AccordionTrigger className="text-left">
                  Bildetaljer
                </AccordionTrigger>
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
                        className="mt-1"
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
                        className="mt-1"
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
                        className="mt-1"
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
                        className="mt-1"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <div className="flex justify-between">
              <Button type="submit">Spara ändringar</Button>
              {/* Add delete button */}
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteFolder}
              >
                Ta bort mapp
              </Button>
            </div>
          </form>

          <h2 className="text-2xl font-bold mb-4">Ladda upp bilder</h2>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <ImageUploader folderId={folderId} uploadLimit={uploadLimit} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FolderPage;
