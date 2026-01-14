// src/firebase/profile.js
import { doc, updateDoc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { uploadToCloudinary } from '../services/cloudinary';
import { db } from './config';

// In your profile.js file, update the uploadFile function:
const uploadFile = async (userId, file, folder) => {
  try {
    console.log('📤 Starting file upload to Cloudinary:', {
      userId,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      folder: `jobportal/${folder}`
    });

    const result = await uploadToCloudinary(file, `jobportal/${folder}`);
    
    console.log('✅ File uploaded successfully:', {
      originalUrl: result.url,
      fileName: result.fileName,
      fileType: result.fileType
    });
    
    return {
      url: result.url,
      fileName: result.fileName,
      publicId: result.publicId,
    };
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw error;
  }
};

export const updateSeekerProfile = async (userId, profileData, resumeFile = null, photoFile = null) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const existingData = userDoc.exists() ? userDoc.data() : {};

    let resumeResult = null;
    let photoResult = null;

    // Handle uploads
    if (resumeFile) {
      console.log('📤 Uploading resume file:', resumeFile.name, resumeFile.type, resumeFile.size);
      resumeResult = await uploadFile(userId, resumeFile, 'resumes');
    }
    if (photoFile) {
      console.log('📤 Uploading photo file:', photoFile.name, photoFile.type, photoFile.size);
      photoResult = await uploadFile(userId, photoFile, 'profile-photos');
    }

    // ✅ Build updateData AFTER uploads
    const updateData = {
      // Core fields
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
      createdAt: existingData.createdAt || serverTimestamp(),

      // Preserve role!
      role: existingData.role || 'seeker',
    };

    // Add files if uploaded
    if (resumeResult) {
      console.log('📄 Resume upload successful:', resumeResult.url);
      updateData.resumeURL = resumeResult.url;
      updateData.resumeFileName = resumeResult.fileName;
      updateData.resumePublicId = resumeResult.publicId;
      
      // ✅ FIX: Ensure PDF URLs use raw/upload not image/upload
      if (resumeFile && resumeFile.type === 'application/pdf') {
        if (resumeResult.url.includes('/image/upload/')) {
          updateData.resumeURL = resumeResult.url;
          console.log('🔄 Converted resume URL to raw:', updateData.resumeURL);
        }
      }
    }
    // In updateSeekerProfile function, add this after getting resumeResult:
if (resumeResult) {
  console.log('📄 Resume upload successful:', resumeResult.url);
  
  // ✅ FORCE RAW URL FOR PDFs
  let resumeUrl = resumeResult.url;
  if (resumeFile && resumeFile.type === 'application/pdf') {
    if (resumeUrl.includes('/image/upload/')) {
      resumeUrl = resumeUrl.replace('/image/upload/', '/raw/upload/');
      console.log('🔄 Manual fix: Converted to raw URL:', resumeUrl);
    }
  }
  
  updateData.resumeURL = resumeUrl;
  updateData.resumeFileName = resumeResult.fileName;
  updateData.resumePublicId = resumeResult.publicId;
}

    if (photoResult) {
      console.log('📷 Photo upload successful:', photoResult.url);
      updateData.photoURL = photoResult.url;
      updateData.photoFileName = photoResult.fileName;
      updateData.photoPublicId = photoResult.publicId;
    }

    // Save
    if (userDoc.exists()) {
      await updateDoc(userRef, updateData);
    } else {
      await setDoc(userRef, updateData);
    }

    console.log('✅ Profile saved successfully with data:', updateData);
    return { success: true, data: updateData };
  } catch (error) {
    console.error('❌ Error saving profile:', error);
    throw new Error(`Failed to save profile: ${error.message}`);
  }
};

export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const data = userDoc.data();
      
      // ✅ FIX: Ensure resume URLs are correct for downloads
      let resumeURL = data.resumeURL || '';
      if (resumeURL && resumeURL.includes('/image/upload/')) {
        // Convert image URLs to raw URLs for PDFs
        if (data.resumeFileName && data.resumeFileName.endsWith('.pdf')) {
          resumeURL = resumeURL.replace('/image/upload/', '/raw/upload/');
          console.log('🔄 Fixed resume URL for download:', resumeURL);
        }
      }
      
      return {
        fullName: data.fullName || '',
        phone: data.phone || '',
        location: data.location || '',
        headline: data.headline || '',
        email: data.email || '',
        skills: data.skills || [],
        experienceLevel: data.experienceLevel || '',
        education: data.education || [],
        resumeURL: resumeURL,
        resumeFileName: data.resumeFileName || '',
        photoURL: data.photoURL || '',
        photoFileName: data.photoFileName || '',
        profileCompleted: data.profileCompleted || false,
        createdAt: data.createdAt?.toDate?.() || null,
        updatedAt: data.updatedAt?.toDate?.() || null,
        jobTitle: data.jobTitle || '',
        about: data.about || '',
        socialLinks: data.socialLinks || {},
        preferredJobTypes: data.preferredJobTypes || [],
        salaryExpectation: data.salaryExpectation || ''
      };
    }
    return null;
  } catch (error) {
    console.error('❌ Error getting profile:', error);
    throw error;
  }
};