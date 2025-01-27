import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { storage, auth } from '@/lib/firebase';
import { toast } from 'sonner';

export const saveProcessedImage = async (imageBlob: Blob, folderId: string): Promise<string> => {
  const user = auth.currentUser;
  if (!user) {
    console.error('User not authenticated');
    toast.error('Du måste vara inloggad för att spara bilder.');
    throw new Error('User not authenticated');
  }

  try {
    const imagePath = `processedImages/${user.uid}/${folderId}/${Date.now()}.png`;
    const storageRef = ref(storage, imagePath);
    
    await uploadBytes(storageRef, imageBlob);
    const downloadURL = await getDownloadURL(storageRef);
    console.log('Image saved successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error saving processed image:', error);
    if (error.code === 'storage/unauthorized') {
      toast.error('Du har inte behörighet att spara bilder. Kontakta administratören.');
    } else {
      toast.error('Ett fel uppstod när bilden skulle sparas. Försök igen senare.');
    }
    throw error;
  }
};

export const getUserProcessedImages = async (folderId: string): Promise<string[]> => {
  const user = auth.currentUser;
  if (!user) {
    console.error('User not authenticated');
    toast.error('Du måste vara inloggad för att se dina bilder.');
    return [];
  }

  try {
    const listRef = ref(storage, `processedImages/${user.uid}/${folderId}`);
    const res = await listAll(listRef);
    const urls = await Promise.all(res.items.map(itemRef => getDownloadURL(itemRef)));
    console.log('Fetched processed images:', urls);
    return urls;
  } catch (error) {
    console.error('Error fetching user processed images:', error);
    toast.error('Ett fel uppstod när dina bilder skulle hämtas. Försök igen senare.');
    return [];
  }
};