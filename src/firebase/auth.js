// src/firebase/auth.js
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

export const signupWithEmail = async (email, password, role) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      role, // ✅ Consistent field name
      fullName: '', 
      photoURL: '',
      profileCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { email: user.email, uid: user.uid, role };
  } catch (error) {
    console.error('❌ Email signup error:', error.message);
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error('❌ Email login error:', error.message);
    throw error;
  }
};

export const loginWithGoogle = async (role) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        role, // ✅
        fullName: user.displayName || '', 
        photoURL: user.photoURL || '',
        profileCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return user;
  } catch (error) {
    console.error('❌ Google login error:', error.message);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('❌ Logout error:', error.message);
    throw error;
  }
};