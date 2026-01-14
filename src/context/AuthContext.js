import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getUserProfile } from '../firebase/profile';
import { getCompanyProfile } from '../firebase/company';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [companyProfile, setCompanyProfile] = useState(null);

  // Load profile based on user role
  const loadUserProfile = async (userId, role) => {
    try {
      let profile = null;
      
      if (role === 'seeker') {
        profile = await getUserProfile(userId);
      } else if (role === 'employer') {
        profile = await getCompanyProfile(userId);
      }
      
      if (profile) {
        setProfileData(profile);
        setProfileCompleted(profile.profileCompleted || false);
        
        // Set company profile separately for easy access
        if (role === 'employer') {
          setCompanyProfile(profile);
        } else {
          setCompanyProfile(null);
        }
        
        return profile;
      } else {
        setProfileData(null);
        setProfileCompleted(false);
        setCompanyProfile(null);
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading profile:', error);
      setProfileData(null);
      setProfileCompleted(false);
      setCompanyProfile(null);
      throw error;
    }
  };

  useEffect(() => {
    let timer;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        if (user) {
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            photoURL: user.photoURL,
          });

          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const role = data.role || null;
            
            setUserRole(role);
            setProfileCompleted(data.profileCompleted || false);
            
            // Load appropriate profile based on role
            await loadUserProfile(user.uid, role);
          } else {
            setUserRole(null);
            setProfileCompleted(false);
            setProfileData(null);
            setCompanyProfile(null);
          }
        } else {
          setCurrentUser(null);
          setUserRole(null);
          setProfileCompleted(false);
          setProfileData(null);
          setCompanyProfile(null);
        }
        setLoading(false);
      }, 300);
    });

    return () => {
      if (timer) clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const refreshProfileData = async () => {
    if (!currentUser?.uid || !userRole) return null;
    setRefreshing(true);
    try {
      return await loadUserProfile(currentUser.uid, userRole);
    } finally {
      setRefreshing(false);
    }
  };

  // Helper functions to check user type
  const isSeeker = userRole === 'seeker';
  const isCompany = userRole === 'employer';

  // Get appropriate profile details based on role
  const getProfileDetails = () => {
    if (isSeeker) {
      return {
        fullName: profileData?.fullName || '',
        headline: profileData?.headline || '',
        photoURL: profileData?.photoURL || '',
        resumeURL: profileData?.resumeURL || '',
        location: profileData?.location || '',
      };
    } else if (isCompany) {
      return {
        companyName: profileData?.companyName || '',
        logoURL: profileData?.logoURL || '',
        industry: profileData?.industry || '',
        location: profileData?.location || '',
        companyWebsite: profileData?.companyWebsite || '',
      };
    }
    return {};
  };

  const value = {
    // Basic auth state
    currentUser,
    userRole,
    loading,
    refreshing,
    profileCompleted,
    
    // Profile data
    profileData,
    companyProfile: isCompany ? profileData : null, // Alias for company profile
    
    // Authentication status
    isAuthenticated: !!currentUser,
    isSeeker,
    isCompany,
    
    // Helper getters
    profileDetails: getProfileDetails(),
    
    // Update functions
    setProfileCompleted,
    setProfileData,
    refreshProfileData,
    
    // Convenience functions
    getDisplayName: () => {
      if (isSeeker) return profileData?.fullName || currentUser?.email || '';
      if (isCompany) return profileData?.companyName || currentUser?.email || '';
      return currentUser?.email || '';
    },
    
    getProfileImage: () => {
      if (isSeeker) return profileData?.photoURL || currentUser?.photoURL;
      if (isCompany) return profileData?.logoURL;
      return currentUser?.photoURL;
    },
    
    // Type-specific data accessors
    getSeekerData: () => isSeeker ? profileData : null,
    getCompanyData: () => isCompany ? profileData : null,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};