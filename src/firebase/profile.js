import { 
  doc, 
  updateDoc, 
  getDoc, 
  serverTimestamp,
  setDoc 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './config';
import { uploadToCloudinary } from '../services/cloudinary';

// Generic file upload function
// firebase/profile.js - Update the uploadFile function
const uploadFile = async (userId, file, folder) => {
  try {
    console.log(`📤 Uploading ${file.name} (${file.type}) to Cloudinary...`);
    
    // Use the dedicated Cloudinary service
    const result = await uploadToCloudinary(file, `jobportal/${folder}`);
    
    console.log(`✅ Upload successful - Resource type: ${result.resourceType || 'auto'}`);
    
    return {
      url: result.url,
      fileName: file.name,
      publicId: result.publicId,
      resourceType: result.resourceType
    };
    
  } catch (error) {
    console.error(`❌ Upload error:`, error);
    throw error;
  }
};

// Delete old file if exists
const deleteOldFile = async (storagePath) => {
  try {
    if (!storagePath) return;
    
    const oldFileRef = ref(storage, storagePath);
    await deleteObject(oldFileRef);
    console.log('✅ Old file deleted:', storagePath);
  } catch (error) {
    // Don't throw error if file doesn't exist
    if (error.code !== 'storage/object-not-found') {
      console.error('⚠️ Error deleting old file:', error);
    }
  }
};

// Upload resume (for backward compatibility)
export const uploadResume = async (userId, file) => {
  const result = await uploadFile(userId, file, 'resumes');
  return result?.url || null;
};

// Upload profile photo
export const uploadProfilePhoto = async (userId, file) => {
  const result = await uploadFile(userId, file, 'profile-photos');
  return result || null;
};

// Update seeker profile with both resume and photo
export const updateSeekerProfile = async (userId, profileData, resumeFile = null, photoFile = null) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    console.log('Starting comprehensive profile update for user:', userId);
    console.log('Profile data:', profileData);
    console.log('Resume file:', resumeFile?.name || 'none');
    console.log('Photo file:', photoFile?.name || 'none');
    
    // Get existing user data to check for old files
    const userDoc = await getDoc(userRef);
    const existingData = userDoc.exists() ? userDoc.data() : {};
    
    let resumeResult = null;
    let photoResult = null;
    
    // Handle resume upload
    if (resumeFile) {
      try {
        // Delete old resume if exists
        if (existingData.resumeStoragePath) {
          await deleteOldFile(existingData.resumeStoragePath);
        }
        
        resumeResult = await uploadFile(userId, resumeFile, 'resumes');
        console.log('✅ Resume uploaded successfully');
      } catch (uploadError) {
        console.error('⚠️ Failed to upload resume:', uploadError);
        // Continue with profile update even if resume upload fails
      }
    }
    
    // Handle profile photo upload
    if (photoFile) {
      try {
        // Delete old photo if exists
        if (existingData.photoStoragePath) {
          await deleteOldFile(existingData.photoStoragePath);
        }
        
        photoResult = await uploadFile(userId, photoFile, 'profile-photos');
        console.log('✅ Profile photo uploaded successfully');
      } catch (uploadError) {
        console.error('⚠️ Failed to upload profile photo:', uploadError);
        // Continue with profile update even if photo upload fails
      }
    }
    
    // Prepare update data
    // In your updateSeekerProfile function, ensure this part:
const updateData = {
  fullName: profileData.fullName || '', 
  phone: profileData.phone || '',
  location: profileData.location || '',
  headline: profileData.headline || '',
  skills: profileData.skills || [],
  experienceLevel: profileData.experienceLevel || '',
  education: profileData.education || [],
  profileCompleted: true,
  updatedAt: serverTimestamp(),
  lastProfileUpdate: serverTimestamp(),
};

// ADD THESE LINES:
if (profileData.photoURL) {
  updateData.photoURL = profileData.photoURL;
}
if (profileData.photoFileName) {
  updateData.photoFileName = profileData.photoFileName;
}
if (profileData.resumeURL) {
  updateData.resumeURL = profileData.resumeURL;
}
if (profileData.resumeFileName) {
  updateData.resumeFileName = profileData.resumeFileName;
}
    
    // Add resume data
// In updateSeekerProfile function:
if (resumeResult) {
  updateData.resumeURL = resumeResult.url;
  updateData.resumeFileName = resumeResult.fileName;
  updateData.resumePublicId = resumeResult.publicId;  // New field
}

if (photoResult) {
  updateData.photoURL = photoResult.url;
  updateData.photoFileName = photoResult.fileName;
  updateData.photoPublicId = photoResult.publicId;  // New field
}
    
    // Add timestamps
    updateData.createdAt = existingData.createdAt || serverTimestamp();
    
    console.log('Final update data:', updateData);
    
    // Update or create document
    if (userDoc.exists()) {
      await updateDoc(userRef, updateData);
    } else {
      await setDoc(userRef, updateData);
    }
    
    console.log('✅ Profile saved to Firestore successfully');
    
    return {
      success: true,
      data: updateData,
      message: 'Profile updated successfully'
    };
    
  } catch (error) {
    console.error('❌ Error saving profile:', error);
    throw new Error(`Failed to save profile: ${error.message}`);
  }
};

// Get comprehensive user profile
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      console.log('Retrieved comprehensive profile data:', {
        hasPhoto: !!data.photoURL,
        hasResume: !!data.resumeURL,
        skillsCount: data.skills?.length || 0
      });
      
      return {
        // Personal Info
        fullName: data.fullName || '',
        phone: data.phone || '',
        location: data.location || '',
        headline: data.headline || '',
        email: data.email || '',
        
        // Skills & Experience
        skills: data.skills || [],
        experienceLevel: data.experienceLevel || '',
        
        // Education
        education: data.education || [],
        
        // Files
        resumeURL: data.resumeURL || '',
        resumeFileName: data.resumeFileName || '',
        resumeStoragePath: data.resumeStoragePath || '',
        
        photoURL: data.photoURL || '',
        photoFileName: data.photoFileName || '',
        photoStoragePath: data.photoStoragePath || '',
        
        // Metadata
        profileCompleted: data.profileCompleted || false,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
        
        // Additional fields
        jobTitle: data.jobTitle || '',
        about: data.about || '',
        socialLinks: data.socialLinks || {},
        preferredJobTypes: data.preferredJobTypes || [],
        salaryExpectation: data.salaryExpectation || ''
      };
    }
    
    console.log('No user document found for ID:', userId);
    return null;
  } catch (error) {
    console.error('❌ Error getting profile:', error);
    throw error;
  }
};

// Delete user files (for account cleanup)
export const deleteUserFiles = async (userId) => {
  try {
    console.log('Cleaning up files for user:', userId);
    
    // Get user data first
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.log('No user data found, nothing to delete');
      return;
    }
    
    const userData = userDoc.data();
    
    // Delete resume if exists
    if (userData.resumeStoragePath) {
      await deleteOldFile(userData.resumeStoragePath);
    }
    
    // Delete profile photo if exists
    if (userData.photoStoragePath) {
      await deleteOldFile(userData.photoStoragePath);
    }
    
    console.log('✅ User files cleaned up successfully');
  } catch (error) {
    console.error('❌ Error deleting user files:', error);
    throw error;
  }
};

// Update only specific profile fields
export const updatePartialProfile = async (userId, updateFields) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Add update timestamp
    const updateData = {
      ...updateFields,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(userRef, updateData);
    console.log('✅ Partial profile update successful');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error in partial profile update:', error);
    throw error;
  }
};