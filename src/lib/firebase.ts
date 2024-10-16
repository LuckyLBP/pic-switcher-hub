import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB1GktW0V6MCUaSSKzXyXYfzEwGqwu3Smo",
  authDomain: "autoscape-c4faa.firebaseapp.com",
  projectId: "autoscape-c4faa",
  storageBucket: "autoscape-c4faa.appspot.com",
  messagingSenderId: "588965615422",
  appId: "1:588965615422:web:3b418fdc180b4046693e6f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

interface UserData {
  companyName: string;
  contactPerson: string;
  phoneNumber: string;
  logo: File | null;
  isApproved: boolean;
  uploadLimit: number;
  backgroundLimit: number;
  selectedBackgrounds: string[];
}

export const signUp = async (email: string, password: string, role: 'admin' | 'customer', userData: UserData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  let logoUrl = '';
  if (userData.logo) {
    const storageRef = ref(storage, `logos/${user.uid}`);
    await uploadBytes(storageRef, userData.logo);
    logoUrl = await getDownloadURL(storageRef);
  }

  // Set custom claims (role) and additional user data in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    role: role,
    ...userData,
    logo: logoUrl
  });

  return userCredential;
};

export const createRegistrationLink = async (email: string, companyName: string) => {
  const linkId = Math.random().toString(36).substring(2, 15);
  await setDoc(doc(db, 'registrationLinks', linkId), {
    email: email,
    companyName: companyName,
    used: false
  });
  return `${window.location.origin}/register/${linkId}`;
};

export const validateRegistrationLink = async (linkId: string) => {
  const linkRef = doc(db, 'registrationLinks', linkId);
  const linkDoc = await getDoc(linkRef);
  if (linkDoc.exists() && !linkDoc.data().used) {
    await updateDoc(linkRef, { used: true });
    return {
      email: linkDoc.data().email,
      companyName: linkDoc.data().companyName
    };
  }
  return null;
};

export { getDoc };
