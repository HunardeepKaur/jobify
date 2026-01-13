import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

export const createUserDocument = async (user, additionalData = {}) => {
  if (!user) return;

  try {
    const userRef = doc(db, 'users', user.uid);
    
    const userSnapshot = await getDoc(userRef);
    
    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        fullName: user.fullName  || '', 
        photoURL: user.photoURL || '',
        userType: additionalData.userType || 'seeker',
        profileCompleted: false,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        ...additionalData
      });
      
      console.log('✅ User document created in Firestore');
    } else {
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