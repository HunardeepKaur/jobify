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
  const [refreshing, setRefreshing] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const loadUserProfile = async (userId) => {
    try {
      const profile = await getUserProfile(userId);
      if (profile) {
        setProfileData(profile);
        setProfileCompleted(profile.profileCompleted || false);
        return profile;
      } else {
        setProfileData(null);
        setProfileCompleted(false);
        return null;
      }
    } catch (error) {
      console.error('❌ Error loading profile:', error);
      setProfileData(null);
      setProfileCompleted(false);
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
            setUserRole(data.role || null); 
            setProfileCompleted(data.profileCompleted || false);
            await loadUserProfile(user.uid);
          } else {
            setUserRole(null);
            setProfileCompleted(false);
            setProfileData(null);
          }
        } else {
          setCurrentUser(null);
          setUserRole(null);
          setProfileCompleted(false);
          setProfileData(null);
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
    if (!currentUser?.uid) return null;
    setRefreshing(true);
    try {
      return await loadUserProfile(currentUser.uid);
    } finally {
      setRefreshing(false);
    }
  };

  const value = {
    currentUser,
    userRole,
    loading,
    refreshing,
    profileCompleted,
    profileData,
    isAuthenticated: !!currentUser,
    isSeeker: userRole === 'seeker',
    isCompany: userRole === 'employer',
    setProfileCompleted,
    setProfileData,
    refreshProfileData,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};