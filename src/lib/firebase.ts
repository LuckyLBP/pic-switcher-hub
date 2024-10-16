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

export const signUp = async (
  email: string,
  password: string,
  role: 'admin' | 'customer',
  userData: UserData & { linkId?: string }
) => {
  if (!email || !password) {
    throw new Error('E-postadress och lösenord krävs.');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Wait for the authentication state to be established
    await new Promise<void>((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if (authUser && authUser.uid === user.uid) {
          unsubscribe();
          resolve();
        }
      });
    });

    // Proceed with Firestore operations after authentication is confirmed
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: role,
      ...userData,
    });

    if (userData.linkId) {
      const linkRef = doc(db, 'registrationLinks', userData.linkId);
      console.log('Updating registration link:', userData.linkId, { used: true });
      await updateDoc(linkRef, { used: true });
    }

    console.log('User account created and data stored in Firestore');
    return userCredential;
  } catch (error: any) {
    console.error('Error in signUp function:', error);
    throw new Error(error.message || 'Registreringen misslyckades. Försök igen.');
  }
};

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const createRegistrationLink = async (email: string, companyName: string) => {
  const linkId = Math.random().toString(36).substring(2, 15);
  await setDoc(doc(db, 'registrationLinks', linkId), {
    email: email,
    companyName: companyName,
    used: false
  });
  return `${BASE_URL}/register/${linkId}`;
};


export const validateRegistrationLink = async (linkId: string) => {
  try {
    console.log('Validating registration link:', linkId);
    const linkRef = doc(db, 'registrationLinks', linkId);
    console.log('Attempting to get document');
    const linkDoc = await getDoc(linkRef);
    console.log('Document retrieved, exists:', linkDoc.exists());
    if (linkDoc.exists() && !linkDoc.data().used) {
      console.log('Link is valid and unused');
      const data = {
        email: linkDoc.data().email,
        companyName: linkDoc.data().companyName,
        linkId: linkId // Pass the linkId for later use
      };
      console.log('Valid link data:', data);
      return data;
    }
    console.log('Invalid or used link');
    return null;
  } catch (error) {
    console.error("Error validating registration link:", error);
    throw new Error('Ett fel uppstod vid validering av registreringslänken.');
  }
};

export const updateUserApprovalStatus = async (userId: string, isApproved: boolean) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { 
    isApproved, 
    status: isApproved ? 'approved' : 'pending'
  });
};

export const updateUserBackgroundLimit = async (userId: string, backgroundLimit: number) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { backgroundLimit });
};

export const updateUserSelectedBackgrounds = async (userId: string, selectedBackgrounds: string[]) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { selectedBackgrounds });
};

export { getDoc };
