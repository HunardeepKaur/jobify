// firebase/auth.js
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // ADD THESE
import { auth, db } from './config'; // MAKE SURE db IS IMPORTED

// 1. EMAIL SIGNUP - FIXED!
// firebase/auth.js - Update signupWithEmail function
// firebase/auth.js - Update signupWithEmail function
export const signupWithEmail = async (email, password, userType) => {
  try {
    // 1. Create auth user
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    console.log('✅ Auth user created:', user.email);
    
    // 2. Create Firestore document - CHANGE HERE
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      userType: userType,
      fullName: '', // CHANGE: Use fullName instead of displayName
      photoURL: '',
      profileCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('✅ Firestore document created for:', user.email);
    
    // 3. SIGN OUT after account creation
    await signOut(auth);
    console.log('✅ User signed out after account creation');
    
    // Return user info (but they're logged out)
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

// 2. EMAIL LOGIN
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

// 3. GOOGLE LOGIN/SIGNUP - FIXED!
// 3. GOOGLE LOGIN/SIGNUP - FIXED!
export const loginWithGoogle = async (userType) => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    console.log('✅ Google auth successful:', user.email);
    
    // Check if user document already exists
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // New user - create document
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        userType: userType,
        fullName: user.displayName || '', // CHANGE: Save Google displayName as fullName
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

// 4. LOGOUT
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('✅ Logout successful');
  } catch (error) {
    console.error('❌ Logout error:', error.message);
    throw error;
  }
};