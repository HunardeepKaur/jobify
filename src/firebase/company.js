import { doc, updateDoc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { uploadToCloudinary } from '../services/cloudinary';
import { db } from './config';

export const updateCompanyProfile = async (userId, companyData, logoFile = null) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const existingData = userDoc.exists() ? userDoc.data() : {};

    let logoResult = null;

    // Handle logo upload
    if (logoFile) {
      console.log('📤 Uploading company logo:', logoFile.name);
      
      const formData = new FormData();
      formData.append('file', logoFile);
      formData.append('upload_preset', 'jobportal_uploads');
      formData.append('folder', 'jobportal/company-logos');
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dl4s1mrwb/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Logo upload failed');
      }

      const data = await response.json();
      logoResult = {
        url: data.secure_url,
        publicId: data.public_id,
        fileName: logoFile.name,
      };
    }

    // Build company update data - SIMPLIFIED
    const updateData = {
      // Only essential fields
      companyName: companyData.companyName || '',
      companyEmail: companyData.companyEmail || '',
      industry: companyData.industry || '',
      companySize: companyData.companySize || '',
      location: companyData.location || '',
      
      // Optional
      companyWebsite: companyData.companyWebsite || '',
      
      // Logo if uploaded
      ...(logoResult && {
        logoURL: logoResult.url,
        logoFileName: logoResult.fileName,
        logoPublicId: logoResult.publicId,
      }),
      
      profileCompleted: true,
      updatedAt: serverTimestamp(),
      lastProfileUpdate: serverTimestamp(),
      role: existingData.role || 'employer',
    };

    // Save company profile
    if (userDoc.exists()) {
      await updateDoc(userRef, updateData);
    } else {
      await setDoc(userRef, updateData);
    }

    console.log('✅ Company profile saved successfully');
    return { success: true, data: updateData };
  } catch (error) {
    console.error('❌ Error saving company profile:', error);
    throw new Error(`Failed to save company profile: ${error.message}`);
  }
};

export const getCompanyProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      
      return {
        // Essential fields only
        companyName: data.companyName || '',
        companyEmail: data.companyEmail || '',
        industry: data.industry || '',
        companySize: data.companySize || '',
        location: data.location || '',
        companyWebsite: data.companyWebsite || '',
        
        // Logo
        logoURL: data.logoURL || '',
        logoFileName: data.logoFileName || '',
        
        // Metadata
        profileCompleted: data.profileCompleted || false,
        updatedAt: data.updatedAt?.toDate?.() || null,
        
        // Contact person (from user)
        contactEmail: data.email || ''
      };
    }
    return null;
  } catch (error) {
    console.error('❌ Error getting company profile:', error);
    throw error;
  }
};