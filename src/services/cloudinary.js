// src/services/cloudinary.js - FIXED VERSION

const CLOUD_NAME = 'dl4s1mrwb';
const UPLOAD_PRESET = 'jobportal_uploads';

export const uploadToCloudinary = async (file, folder = 'jobportal') => {
  let resourceType = 'auto';

  if (file.type === 'application/pdf') {
    resourceType = 'raw';
  } else if (file.type.startsWith('image/')) {
    resourceType = 'image';
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', folder);
  formData.append('filename_override', file.name);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Cloudinary upload failed');
  }

  const data = await response.json();

  return {
    url: data.secure_url,
    publicId: data.public_id,
    fileName: file.name,
    fileType: file.type,
  };
};

export const downloadFileFromCloudinary = (originalUrl, filename) => {
  try {
    const url = new URL(originalUrl);

    // Add fl_attachment correctly without touching resource type
    url.pathname = url.pathname.replace(
      "/upload/",
      "/upload/fl_attachment/"
    );

    const link = document.createElement("a");
    link.href = url.toString();
    link.download = filename || "resume.pdf";
    link.target = "_blank";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (err) {
    console.error("Cloudinary download failed:", err);
    return false;
  }
};



// ✅ Direct download URL generator for Cloudinary
export const getCloudinaryDownloadUrl = (url, fileName = 'download') => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  try {
    const cleanFileName = fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_+/g, '_')
      .trim();
    
    let downloadUrl = url;
    
    // Ensure PDFs use raw/upload
    if (downloadUrl.includes('/image/upload/') && fileName.endsWith('.pdf')) {
      downloadUrl = downloadUrl.replace('/image/upload/', '/raw/upload/');
    }
    
    // Add fl_attachment transformation
    const urlObj = new URL(downloadUrl);
    const pathParts = urlObj.pathname.split('/');
    const uploadIndex = pathParts.indexOf('upload');
    
    if (uploadIndex !== -1) {
      pathParts.splice(uploadIndex + 1, 0, `fl_attachment:${cleanFileName}`);
      const newPath = pathParts.join('/');
      const newUrl = new URL(newPath, urlObj.origin);
      newUrl.search = urlObj.search;
      return newUrl.toString();
    }
    
    return downloadUrl;
  } catch (error) {
    console.error('❌ Error generating download URL:', error);
    return url;
  }
};

// ✅ Test if a Cloudinary URL is accessible
export const checkCloudinaryUrl = async (url) => {
  if (!url || !url.includes('cloudinary.com')) return false;
  
  try {
    // Convert image URLs to raw for PDFs
    let testUrl = url;
    if (url.includes('/image/upload/') && url.endsWith('.pdf')) {
      testUrl = url.replace('/image/upload/', '/raw/upload/');
    }
    
    const response = await fetch(testUrl, { 
      method: 'HEAD',
      mode: 'no-cors' // Use no-cors to avoid CORS issues
    });
    
    // With no-cors, we can't read the status, but if it doesn't throw, it's likely accessible
    return true;
  } catch {
    return false;
  }
};