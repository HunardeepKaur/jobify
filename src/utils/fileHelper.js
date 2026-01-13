// Helper for Cloudinary file downloads
export const getResumeDownloadUrl = (url, fileName) => {
  if (!url) return '';
  
  // If it's a Cloudinary URL
  if (url.includes('cloudinary.com')) {
    // Check if it's already a raw/asset URL
    if (url.includes('/raw/upload/')) {
      // Already correct format for downloads
      return url;
    } else if (url.includes('/image/upload/')) {
      // Wrong! PDF is in image folder - fix it
      // Replace /image/upload/ with /raw/upload/
      const fixedUrl = url.replace('/image/upload/', '/raw/upload/');
      console.log('Fixed resume URL:', fixedUrl);
      return fixedUrl;
    }
  }
  
  return url;
};

// Alternative: Force download via proxy
export const forceDownloadResume = async (url, fileName = 'resume.pdf') => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Download failed:', error);
    // Fallback to direct link
    window.open(url, '_blank');
  }
};