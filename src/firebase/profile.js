import { 
  doc, 
  updateDoc, 
  getDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';

// Upload resume to Firebase Storage and get URL
export const uploadResume = async (userId, file) => {
  try {
    if (!file) {
      console.log('No file provided for upload');
      return null;
    }
    
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      throw new Error('Please upload PDF or Word documents only');
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size should be less than 5MB');
    }
    
    console.log('Starting resume upload for user:', userId);
    
    // Create storage reference with unique filename
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const storageRef = ref(storage, `resumes/${userId}/${timestamp}_${sanitizedFileName}`);
    
    // Upload file
    console.log('Uploading to path:', `resumes/${userId}/${timestamp}_${sanitizedFileName}`);
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    console.log('✅ Resume uploaded successfully. URL:', downloadURL);
    
    return downloadURL;
    
  } catch (error) {
    console.error('❌ Error uploading resume:', error);
    throw error;
  }
};

// Update job seeker profile with resume upload
// Update job seeker profile with resume upload
export const updateSeekerProfile = async (userId, profileData, resumeFile = null) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    console.log('Starting profile update for user:', userId);
    console.log('Profile data to save:', profileData);
    
    let resumeURL = '';
    let resumeFileName = '';
    
    // Upload resume if file exists
    if (resumeFile) {
      try {
        resumeURL = await uploadResume(userId, resumeFile);
        resumeFileName = resumeFile.name;
        console.log('Resume uploaded. URL:', resumeURL);
      } catch (uploadError) {
        console.error('Failed to upload resume, but continuing with profile update:', uploadError);
        // Don't throw error here - allow profile to save without resume
      }
    }
    
    const updateData = {
      fullName: profileData.fullName || '', // Save fullName as displayName
      phone: profileData.phone || '',
      location: profileData.location || '',
      headline: profileData.headline || '',
      skills: profileData.skills || [],
      experienceLevel: profileData.experienceLevel || '',
      education: profileData.education || [],
      profileCompleted: true,
      updatedAt: serverTimestamp(),
      profileUpdatedAt: serverTimestamp(),
    };
    
    // Add resume data if available
    if (resumeURL) {
      updateData.resumeURL = resumeURL;
      updateData.resumeFileName = resumeFileName;
    } else if (profileData.resumeFileName) {
      // Keep existing resume filename if no new file uploaded
      updateData.resumeFileName = profileData.resumeFileName;
    }
    
    console.log('Final data to save to Firestore:', updateData);
    
    await updateDoc(userRef, updateData);
    console.log('✅ Profile saved to Firestore successfully');
    
    return {
      success: true,
      data: updateData
    };
    
  } catch (error) {
    console.error('❌ Error saving profile:', error);
    throw new Error(`Failed to save profile: ${error.message}`);
  }
};

// Get user profile (UPDATED for new education structure)
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      console.log('Retrieved profile data from Firestore:', data);
      
      // Return structured data for form
      return {
        fullName: data.fullName || '',
        phone: data.phone || '',
        location: data.location || '',
        headline: data.headline || '',
        skills: data.skills || [],
        experienceLevel: data.experienceLevel || '',
        education: data.education || [],
        resumeURL: data.resumeURL || '',
        resumeFileName: data.resumeFileName || '',
        profileCompleted: data.profileCompleted || false
      };
    }
    
    console.log('No user document found for ID:', userId);
    return null;
  } catch (error) {
    console.error('❌ Error getting profile:', error);
    throw error;
  }
};