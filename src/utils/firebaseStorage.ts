import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { storage, auth } from '@/lib/firebase';

export const saveProcessedImage = async (imageBlob: Blob, folderId: string): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const imagePath = `processedImages/${user.uid}/${folderId}/${Date.now()}.png`;
  const storageRef = ref(storage, imagePath);
  
  await uploadBytes(storageRef, imageBlob);
  return getDownloadURL(storageRef);
};

export const getUserProcessedImages = async (folderId: string): Promise<string[]> => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const listRef = ref(storage, `processedImages/${user.uid}/${folderId}`);
  const res = await listAll(listRef);
  return Promise.all(res.items.map(itemRef => getDownloadURL(itemRef)));
};