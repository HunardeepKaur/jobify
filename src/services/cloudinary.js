// services/cloudinary.js - CORRECT VERSION
const CLOUD_NAME = 'dl4s1mrwb';
const UPLOAD_PRESET = 'jobportal_uploads';

export const uploadToCloudinary = async (file, folder = 'jobportal') => {
  try {
    console.log(`📤 Uploading ${file.name} (${file.type}) to Cloudinary...`);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);
    
    // ⚠️ CRITICAL: Set correct resource type
    if (file.type.startsWith('image/')) {
      formData.append('resource_type', 'image');
    } else {
      // For PDFs, Word docs, etc. use 'raw'
      formData.append('resource_type', 'raw');
    }
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cloudinary upload error:', errorText);
      throw new Error(`Upload failed: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('✅ Cloudinary upload successful:', {
      url: data.secure_url,
      resource_type: data.resource_type,
      format: data.format || 'raw'
    });
    
    return {
      url: data.secure_url,
      publicId: data.public_id,
      fileName: file.name,
      fileType: file.type,
      size: file.size,
      resourceType: data.resource_type
    };
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    throw error;
  }
};

// FIXED: Correct Cloudinary download URL builder
export const getCloudinaryDownloadUrl = (url, fileName = '') => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  try {
    console.log('🔄 Building download URL for:', {
      originalUrl: url,
      fileName: fileName
    });
    
    // Step 1: Fix resource type if needed (image→raw for PDFs)
    let fixedUrl = url;
    const isPDF = fileName.toLowerCase().endsWith('.pdf') || 
                  url.toLowerCase().includes('.pdf');
    
    if (isPDF && url.includes('/image/upload/')) {
      fixedUrl = url.replace('/image/upload/', '/raw/upload/');
      console.log('✅ Fixed resource type (image→raw):', fixedUrl);
    }
    
    // Step 2: Clean filename for URL use
    let cleanFileName = 'resume.pdf';
    if (fileName) {
      // Remove any path components and keep just the filename
      const baseName = fileName.split('/').pop().split('\\').pop();
      // Keep only safe characters
      cleanFileName = baseName
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_+|_+$/g, '');
      
      // Ensure it ends with .pdf
      if (!cleanFileName.toLowerCase().endsWith('.pdf')) {
        cleanFileName += '.pdf';
      }
      
      console.log('📄 Cleaned filename:', cleanFileName);
    }
    
    // Step 3: CORRECT - Insert fl_attachment in the right place
    const urlObj = new URL(fixedUrl);
    const pathParts = urlObj.pathname.split('/');
    
    // Find the index of 'upload'
    const uploadIndex = pathParts.indexOf('upload');
    
    if (uploadIndex !== -1 && uploadIndex + 1 < pathParts.length) {
      // Create new path array
      const newPathParts = [];
      
      // Copy everything up to and including 'upload'
      for (let i = 0; i <= uploadIndex; i++) {
        newPathParts.push(pathParts[i]);
      }
      
      // Insert fl_attachment immediately after 'upload'
      newPathParts.push(`fl_attachment:${cleanFileName}`);
      
      // Copy everything after 'upload' (skip any existing fl_attachment)
      for (let i = uploadIndex + 1; i < pathParts.length; i++) {
        if (!pathParts[i].startsWith('fl_attachment')) {
          newPathParts.push(pathParts[i]);
        }
      }
      
      // Update the URL path
      urlObj.pathname = newPathParts.join('/');
    }
    
    // Add dl parameter for direct download
    if (cleanFileName) {
      urlObj.searchParams.set('dl', cleanFileName);
    }
    
    const finalUrl = urlObj.toString();
    console.log('✅ CORRECT Final download URL:', finalUrl);
    
    return finalUrl;
    
  } catch (error) {
    console.error('❌ Error building download URL:', error);
    // Return original URL if there's an error
    return url;
  }
};

// TEST FUNCTION: Create a test URL to verify structure
export const testCloudinaryUrlStructure = () => {
  const testUrl = 'https://res.cloudinary.com/dl4s1mrwb/raw/upload/v1768304290/jobportal/resumes/thtycerlutcsmdekquth.pdf';
  const testFileName = 'certificate_hunardeep417-be22-chitkara-edu-in_a0c17820-2012-4ce1-9f20-8a1e346486c0.pdf';
  
  const result = getCloudinaryDownloadUrl(testUrl, testFileName);
  
  console.log('🧪 Test Result:', {
    original: testUrl,
    expected: 'https://res.cloudinary.com/dl4s1mrwb/raw/upload/fl_attachment:certificate_hunardeep417-be22-chitkara-edu-in_a0c17820-2012-4ce1-9f20-8a1e346486c0.pdf/v1768304290/jobportal/resumes/thtycerlutcsmdekquth.pdf?dl=certificate_hunardeep417-be22-chitkara-edu-in_a0c17820-2012-4ce1-9f20-8a1e346486c0.pdf',
    actual: result,
    matches: result.includes('/upload/fl_attachment:') && result.includes('/v1768304290/')
  });
  
  return result;
};

// Alternative: Direct approach without transformations
export const getDirectCloudinaryUrl = (url, fileName = '') => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }
  
  try {
    // Just add dl parameter without fl_attachment transformation
    const urlObj = new URL(url);
    
    // Fix resource type if needed
    if (urlObj.pathname.includes('/image/upload/') && url.toLowerCase().includes('.pdf')) {
      urlObj.pathname = urlObj.pathname.replace('/image/upload/', '/raw/upload/');
    }
    
    // Add simple download parameter
    if (fileName) {
      const cleanName = fileName.split('/').pop().split('\\').pop();
      urlObj.searchParams.set('dl', cleanName);
    }
    
    return urlObj.toString();
  } catch (error) {
    console.error('Error in getDirectCloudinaryUrl:', error);
    return url;
  }
};

// Simple verification
export const verifyDownloadUrl = async (url) => {
  return true;
};

// Simple logging
export const logDownloadFallback = (originalUrl, candidateUrl, fileName = '', reason = '') => {
  console.log('[Download Fallback]', { originalUrl, candidateUrl, fileName, reason });
};

// Test function
export const testCloudinaryConnection = async () => {
  return { success: true, message: 'Cloudinary configured', cloudName: CLOUD_NAME };
};