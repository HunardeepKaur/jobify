import { 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

export const signupWithEmail = async (email, password, userType) => {
  try {
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    console.log('✅ Auth user created:', user.email);
    
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      userType: userType,
      fullName: '', 
      photoURL: '',
      profileCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Firestore document created for:', user.email);
    
    // await signOut(auth);
    // console.log('✅ User signed out after account creation');
    
    return {
      email: user.email,
      uid: user.uid,
      userType: userType
    };
    
  } catch (error) {
    console.error('❌ Email signup error:', error.message);
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Email login successful:', result.user.email);
    return result.user;
  } catch (error) {
    console.error('❌ Email login error:', error.message);
    throw error;
  }
};

export const loginWithGoogle = async (userType) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    console.log('✅ Google auth successful:', user.email);
    
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        userType: userType,
        fullName: user.displayName || '', 
        photoURL: user.photoURL || '',
        profileCompleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ New Google user document created');
    } else {
      console.log('✅ Existing Google user logged in');
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
    console.log('✅ Logout successful');
  } catch (error) {
    console.error('❌ Logout error:', error.message);
    throw error;
  }
};