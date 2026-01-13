import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logoutUser } from '../firebase/auth';
import { useState, useRef, useEffect } from 'react';
import { getCloudinaryDownloadUrl, verifyDownloadUrl, logDownloadFallback } from '../services/cloudinary';
import { useToast } from './ToastContext';

function Navbar() {
  const { currentUser, userRole, loading, profileData } = useAuth();
  const { addToast } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setDropdownOpen(false);
  };

  // Get user's first initial for avatar
  const getUserInitial = () => {
  // First try to use photo if available
  if (profileData?.photoURL) {
    return null; // Will show image instead
  }
  if (profileData?.displayName) {
    return profileData.displayName.charAt(0).toUpperCase();
  }
  if (currentUser?.email) {
    return currentUser.email.charAt(0).toUpperCase();
  }
  return 'U';
};

  // Truncate text function
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <nav className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-800">Jobify</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center">
          {loading ? (
            <div className="flex items-center space-x-2 px-4 py-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-sky-500 rounded-full animate-spin"></div>
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          ) : currentUser ? (
            <div className="relative" ref={dropdownRef}>
              {/* User Profile Button - Clean Design */}
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                {/* User Info - Desktop */}
                <div className="hidden md:flex flex-col items-end">
                  <p className="text-sm font-medium text-gray-700 truncate max-w-[140px]">
                    {profileData?.displayName || currentUser.email}
                  </p>
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-0.5 ${
                    userRole === 'seeker' 
                      ? 'bg-sky-100 text-sky-700' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {userRole === 'seeker' ? (
                      <>
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        Job Seeker
                      </>
                    ) : (
                      <>
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                        </svg>
                        Employer
                      </>
                    )}
                  </div>
                </div>
                
                {/* Mobile Only - Simple Avatar */}
                {/* Mobile Only - Simple Avatar */}
<div className="md:hidden flex items-center space-x-2">
  <div className={`w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${
    userRole === 'seeker' 
      ? 'bg-gradient-to-br from-sky-400 to-sky-500' 
      : 'bg-gradient-to-br from-emerald-400 to-emerald-500'
  }`}>
    {profileData?.photoURL ? (
      <img 
        src={profileData.photoURL} 
        alt="Profile" 
        className="w-full h-full object-cover"
        crossOrigin="anonymous"
      />
    ) : (
      <span className="font-semibold text-sm text-white">{getUserInitial()}</span>
    )}
  </div>
</div>
                
                {/* Desktop Avatar */}
{/* Desktop Avatar */}
<div className="hidden md:flex">
  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 overflow-hidden ${
    userRole === 'seeker' 
      ? 'border-sky-200' 
      : 'border-emerald-200'
  } ${!profileData?.photoURL ? (userRole === 'seeker' ? 'bg-gradient-to-br from-sky-100 to-sky-50 text-sky-600' : 'bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600') : ''}`}>
    {profileData?.photoURL ? (
      <img 
        src={profileData.photoURL} 
        alt="Profile" 
        className="w-full h-full object-cover"
        crossOrigin="anonymous"
      />
    ) : (
      <span className="font-semibold text-sm">{getUserInitial()}</span>
    )}
  </div>
</div>
                
                {/* Arrow Icon */}
                <svg 
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu - Clean & Minimal */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-sky-50 to-emerald-50">
                    <div className="flex items-start">
                      {/* Avatar */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                        userRole === 'seeker' 
                          ? 'bg-gradient-to-br from-sky-400 to-sky-500 text-white' 
                          : 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white'
                      }`}>
                        <span className="font-semibold text-lg">{getUserInitial()}</span>
                      </div>
                      
                      {/* User Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 mb-1 truncate">
                          {profileData?.displayName || currentUser.email}
                        </p>
                        {profileData?.headline && (
                          <p className="text-xs text-gray-600 mb-2 truncate">
                            {truncateText(profileData.headline, 40)}
                          </p>
                        )}
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${
                          userRole === 'seeker' 
                            ? 'bg-sky-100 text-sky-800' 
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {userRole === 'seeker' ? (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                              </svg>
                              Job Seeker
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                              </svg>
                              Employer
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Profile Summary */}
                    
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-2">
                    {/* Profile */}
{/* Profile */}
<Link 
  to={userRole === 'seeker' ? '/seeker/profile/view' : '/company/profile/view'}
  onClick={() => setDropdownOpen(false)}
  className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
>
  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
    userRole === 'seeker' 
      ? 'bg-gradient-to-r from-sky-100 to-sky-50 text-sky-600' 
      : 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-600'
  }`}>
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  </div>
  <div>
    <p className="font-medium text-gray-900">Profile</p>
    <p className="text-xs text-gray-500">
      {profileData?.profileCompleted ? 'View your profile' : 'Complete your profile'}
    </p>
  </div>
</Link>
                    
                    {/* Dashboard Link */}
                    <Link 
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-100 to-blue-50 text-blue-600 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Dashboard</p>
                        <p className="text-xs text-gray-500">View your dashboard</p>
                      </div>
                    </Link>
                    
                    {/* Resume Download */}
                    {profileData?.resumeURL && ( <button 
    onClick={async (e) => {
      e.preventDefault();
      setDropdownOpen(false);

      const fileName = profileData.resumeFileName || 'resume.pdf';
      const candidate = profileData.resumeURL && profileData.resumeURL.includes('cloudinary.com')
        ? getCloudinaryDownloadUrl(profileData.resumeURL, fileName)
        : profileData.resumeURL;

      const ok = await verifyDownloadUrl(candidate);

      if (ok) {
        const link = document.createElement('a');
        link.href = candidate;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(profileData.resumeURL, '_blank', 'noopener,noreferrer');
        addToast('Download failed; opened resume in a new tab.', 'warning');
        try { logDownloadFallback(profileData.resumeURL, candidate, fileName, 'verify_failed'); } catch (e) { /* ignore */ }
      }
    }}
    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors group text-left"
  >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-600 flex items-center justify-center mr-3">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Download Resume</p>
                          <p className="text-xs text-gray-500 truncate max-w-[180px]">
                            {profileData.resumeFileName || 'Resume.pdf'}
                          </p>
                        </div>
                      </button>
                    )}
                    
                    {/* Divider */}
                    <div className="border-t border-gray-100 my-2"></div>
                    
                    {/* Logout */}
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-red-100 to-pink-100 flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="font-medium">Logout</p>
                        <p className="text-xs text-gray-500">Sign out of your account</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              {/* Home Link */}
              <Link 
                to="/" 
                className="px-4 py-2 text-sm text-gray-700 hover:text-sky-600 hover:bg-gray-50 rounded-xl transition-colors font-medium"
              >
                Home
              </Link>
              
              {/* Login Link */}
              <Link 
                to="/login" 
                className="px-4 py-2 text-sm text-gray-700 hover:text-sky-600 hover:bg-gray-50 rounded-xl transition-colors font-medium"
              >
                Login
              </Link>
              
              {/* Sign Up Button */}
              <Link 
                to="/signup" 
                className="px-4 py-2 text-sm bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 shadow-sm hover:shadow font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;