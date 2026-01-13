import { 
  signInWithPopup, 
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from '../firebase/config';

// Google Login
export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log('✅ Google login successful:', result.user.email);
    return result.user;
  } catch (error) {
    console.error('❌ Google login error:', error.message);
    throw error;
  }
};

// Email/Password Signup
export const signupWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ Email signup successful:', result.user.email);
    return result.user;
  } catch (error) {
    console.error('❌ Email signup error:', error.message);
    throw error;
  }
};

// Email/Password Login
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

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log('✅ Logout successful');
  } catch (error) {
    console.error('❌ Logout error:', error.message);
    throw error;
  }
};