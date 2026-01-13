import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getUserProfile } from '../firebase/profile';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // NEW: Refresh state
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  
  // Function to load user profile data
  const loadUserProfile = async (userId) => {
    try {
      console.log('🚀 Loading profile for user:', userId);
      const profile = await getUserProfile(userId);
      
      if (profile) {
        console.log('✅ Profile loaded successfully:', {
          hasPhoto: !!profile.photoURL,
          photoURL: profile.photoURL,
          hasResume: !!profile.resumeURL,
          resumeURL: profile.resumeURL,
          fullName: profile.fullName
        });
        
        // FORCE STATE UPDATE - Use functional update
        setProfileData(prev => {
          console.log('🔄 Updating profileData state');
          return profile;
        });
        
        setProfileCompleted(profile.profileCompleted || false);
        return profile; // RETURN THE PROFILE
      } else {
        console.log('❌ No profile data found');
        setProfileData(null);
        setProfileCompleted(false);
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
      setProfileData(null);
      setProfileCompleted(false);
      throw error;
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
        console.log('🔄 Auth state changed, user:', user?.email);
        
        if (user) {
          // User is signed in
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
              console.log('📋 User data from Firestore:', userData);
              
              setUserRole(userData.userType || null);
              setProfileCompleted(userData.profileCompleted || false);
              
              // Load detailed profile data
              await loadUserProfile(user.uid);
            } else {
              console.log('⚠️ No Firestore document found');
              setUserRole(null);
              setProfileCompleted(false);
              setProfileData(null);
            }
          } catch (error) {
            console.error('❌ Error fetching user data:', error);
            setUserRole(null);
            setProfileCompleted(false);
            setProfileData(null);
          }
        } else {
          // User is signed out
          console.log('👋 User signed out');
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

  // Function to manually refresh profile data - FIXED VERSION
  const refreshProfileData = async () => {
    if (!currentUser?.uid) {
      console.log('❌ Cannot refresh: No user logged in');
      return null;
    }
    
    console.log('🔄 REFRESHING PROFILE DATA...');
    setRefreshing(true);
    
    try {
      const freshProfile = await loadUserProfile(currentUser.uid);
      console.log('✅ Refresh complete:', freshProfile);
      return freshProfile; // CRITICAL: Return the data
    } catch (error) {
      console.error('❌ Error refreshing profile:', error);
      throw error;
    } finally {
      setRefreshing(false);
    }
  };

  // NEW: Function to force update specific fields
  const updateProfileField = (field, value) => {
    setProfileData(prev => {
      if (!prev) return { [field]: value };
      return { ...prev, [field]: value };
    });
  };

  // Context value
  const value = {
    currentUser,
    userRole,
    loading,
    refreshing, // NEW: Expose refreshing state
    profileCompleted,
    profileData,
    isAuthenticated: !!currentUser,
    isSeeker: userRole === 'seeker',
    isCompany: userRole === 'company',
    setProfileCompleted,
    setProfileData,
    setIsSigningUp,
    refreshProfileData,
    updateProfileField, // NEW: Direct field update
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};