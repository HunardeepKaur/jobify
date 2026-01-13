import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

// 1️⃣ Create user document in Firestore
// 1️⃣ Create user document in Firestore
export const createUserDocument = async (user, additionalData = {}) => {
  if (!user) return;

  try {
    // Reference to the user document
    const userRef = doc(db, 'users', user.uid);
    
    // Check if document already exists
    const userSnapshot = await getDoc(userRef);
    
    if (!userSnapshot.exists()) {
      // Create new user document
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        fullName: user.fullName || user.displayName || '', // CHANGE: Use fullName
        photoURL: user.photoURL || '',
        userType: additionalData.userType || 'seeker',
        profileCompleted: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        ...additionalData
      });
      
      console.log('✅ User document created in Firestore');
    } else {
      // Update last login for existing user
      await updateDoc(userRef, {
        lastLogin: serverTimestamp()
      });
    }
    
    return userRef;
  } catch (error) {
    console.error('❌ Error creating user document:', error);
    throw error;
  }
};

// 2️⃣ Get user data from Firestore
export const getUserDocument = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log('No user document found');
      return null;
    }
  } catch (error) {
    console.error('Error getting user document:', error);
    throw error;
  }
};

// 3️⃣ Update user profile completion status
export const updateProfileCompletion = async (userId, isCompleted = true) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      profileCompleted: isCompleted,
      updatedAt: serverTimestamp()
    });
    console.log('✅ Profile completion status updated');
  } catch (error) {
    console.error('Error updating profile completion:', error);
    throw error;
  }
};