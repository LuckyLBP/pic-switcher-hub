import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  // Replace with your Firebase configuration
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signIn = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email: string, password: string, role: 'admin' | 'customer') => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Set custom claims (role) in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    email: user.email,
    role: role
  });

  return userCredential;
};

export const createRegistrationLink = async (email: string) => {
  const linkId = Math.random().toString(36).substring(2, 15);
  await setDoc(doc(db, 'registrationLinks', linkId), {
    email: email,
    used: false
  });
  return `${window.location.origin}/register/${linkId}`;
};

export const validateRegistrationLink = async (linkId: string) => {
  const linkRef = doc(db, 'registrationLinks', linkId);
  const linkDoc = await getDoc(linkRef);
  if (linkDoc.exists() && !linkDoc.data().used) {
    await updateDoc(linkRef, { used: true });
    return linkDoc.data().email;
  }
  return null;
};
