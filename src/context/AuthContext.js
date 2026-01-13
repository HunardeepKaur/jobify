import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getUserProfile } from '../firebase/profile'; // IMPORT THIS

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  
  // Function to load user profile data
  const loadUserProfile = async (userId) => {
    try {
      console.log('Loading profile for user:', userId);
      const profile = await getUserProfile(userId);
      
      if (profile) {
        console.log('Profile loaded successfully:', profile);
        setProfileData(profile);
        setProfileCompleted(profile.profileCompleted || false);
      } else {
        console.log('No profile data found');
        setProfileData(null);
        setProfileCompleted(false);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setProfileData(null);
      setProfileCompleted(false);
    }
  };

  useEffect(() => {
    let authChangeTimer;
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Clear any existing timer
      if (authChangeTimer) {
        clearTimeout(authChangeTimer);
      }
      
      // Set a timer to wait for auth state to stabilize
      authChangeTimer = setTimeout(async () => {
        if (user) {
          // User is signed in (and stayed signed in for 300ms)
          const userData = {
            uid: user.uid,
            email: user.email,
            fullName: user.fullName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified,
          };
          
          setCurrentUser(userData);

          // Fetch user data from Firestore
          try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              console.log('User data from Firestore:', userData);
              
              setUserRole(userData.userType || null);
              setProfileCompleted(userData.profileCompleted || false);
              
              // Load detailed profile data
              await loadUserProfile(user.uid);
            } else {
              setUserRole(null);
              setProfileCompleted(false);
              setProfileData(null);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            setUserRole(null);
            setProfileCompleted(false);
            setProfileData(null);
          }
        } else {
          // User is signed out (and stayed signed out for 300ms)
          setCurrentUser(null);
          setUserRole(null);
          setProfileCompleted(false);
          setProfileData(null);
        }
        
        setLoading(false);
      }, 300); // Wait 300ms for auth state to stabilize
    });

    // Cleanup
    return () => {
      if (authChangeTimer) {
        clearTimeout(authChangeTimer);
      }
      unsubscribe();
    };
  }, []);

  // Function to manually refresh profile data
  const refreshProfileData = async () => {
    if (currentUser?.uid) {
      await loadUserProfile(currentUser.uid);
    }
  };

  // Context value - ADD refreshProfileData
  const value = {
    currentUser,
    userRole,
    loading,
    profileCompleted,
    profileData,
    isAuthenticated: !!currentUser,
    isSeeker: userRole === 'seeker',
    isCompany: userRole === 'company',
    setProfileCompleted,
    setProfileData,
    setIsSigningUp,
    refreshProfileData, // ADD THIS FUNCTION
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};