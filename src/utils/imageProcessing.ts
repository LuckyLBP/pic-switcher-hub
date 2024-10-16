import axios from 'axios';
import { saveProcessedImage } from './firebaseStorage';
import { toast } from 'sonner';

export const processImage = async (
  imageFile: File,
  selectedBackground: string,
  folderId: string
): Promise<string | null> => {
  const formData = new FormData();
  formData.append("image_file", imageFile);
  formData.append("size", "auto");
  formData.append("bg_image_url", selectedBackground);
  formData.append("add_shadow", "true");

  try {
    const response = await axios.post("https://api.remove.bg/v1.0/removebg", formData, {
      headers: { 
        "X-Api-Key": "aay9Lpk91psu5LSvMhMtyoCk",
        "Content-Type": "multipart/form-data"
      },
      responseType: 'arraybuffer'
    });

    const blob = new Blob([response.data], { type: 'image/png' });
    const savedImageUrl = await saveProcessedImage(blob, folderId);
    toast.success('Bilden har bearbetats och sparats framgångsrikt!');
    return savedImageUrl;
  } catch (error) {
    console.error("Error processing image:", error);
    toast.error("Ett fel uppstod vid bildbehandling. Försök igen.");
    return null;
  }
};