import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { downloadFileFromCloudinary } from '../services/cloudinary'; // ✅ Updated import
import { useToast } from '../components/ToastContext';

function SeekerProfileView() {
  const { profileData, currentUser, refreshProfileData } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (profileData) {
      console.log('Profile Data Received:', profileData);
      setProfile(profileData);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [profileData]);

  // Function to manually refresh profile data
  const handleRefreshProfile = async () => {
    setRefreshing(true);
    try {
      await refreshProfileData();
      // Profile will update via useEffect
      addToast('Profile refreshed successfully', 'success');
    } catch (error) {
      console.error('Error refreshing profile:', error);
      addToast('Failed to refresh profile', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  // Format experience level for better display
  const formatExperienceLevel = (level) => {
    const levels = {
      'fresher': 'Fresher (0-1 year)',
      'entry': 'Entry Level (1-3 years)',
      'mid': 'Mid Level (3-7 years)',
      'senior': 'Senior Level (7+ years)',
      'executive': 'Executive Level'
    };
    return levels[level] || level;
  };

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recently';
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (error) {
      return 'Recently';
    }
  };

  // Get initials for avatar
  const getInitials = () => {
    if (profile?.fullName) {
      return profile.fullName.charAt(0).toUpperCase();
    }
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Handle resume download - ✅ SIMPLIFIED VERSION
  const handleResumeDownload = () => {
    if (!profile?.resumeURL) {
      addToast('No resume available for download', 'error');
      return;
    }
    
    const fileName = profile.resumeFileName || 'resume.pdf';
    
    try {
      const success = downloadFileFromCloudinary(profile.resumeURL, fileName);
      
      if (success) {
        addToast('Resume download started', 'success');
      } else {
        addToast('Opening resume in browser', 'info');
      }
    } catch (error) {
      console.error('Download error:', error);
      addToast('Failed to download resume. Please try again.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-10 text-center border border-white/30">
            <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
              <svg className="w-12 h-12 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Profile Found</h2>
            <p className="text-gray-600 mb-8">You haven't created your profile yet.</p>
            <button
              onClick={() => navigate('/seeker/profile')}
              className="px-8 py-3.5 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl hover:from-sky-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-soft hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Create Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div className="mb-6 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-gray-600">Your professional identity</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleRefreshProfile}
                disabled={refreshing}
                className="px-5 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center"
              >
                {refreshing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-sky-500 rounded-full animate-spin mr-2"></div>
                    Refreshing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </>
                )}
              </button>
              <button
                onClick={() => navigate('/seeker/profile')}
                className="group px-7 py-3.5 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl hover:from-sky-600 hover:to-emerald-600 transition-all duration-300 font-medium shadow-soft hover:shadow-lg flex items-center transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/30 shadow-soft">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-100 to-sky-50 flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-sky-600">{profile.skills?.length || 0}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Skills</p>
                  <p className="text-lg font-semibold text-gray-800">Expertise</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/30 shadow-soft">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-emerald-600">{profile.education?.length || 0}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Education</p>
                  <p className="text-lg font-semibold text-gray-800">Qualifications</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/30 shadow-soft">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center mr-4">
                  <span className="text-lg font-bold text-amber-600">
                    {profile.experienceLevel ? formatExperienceLevel(profile.experienceLevel).charAt(0) : '0'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="text-lg font-semibold text-gray-800">Level</p>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/30 shadow-soft">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center mr-4">
                  {profile.profileCompleted ? (
                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {profile.profileCompleted ? 'Complete' : 'Incomplete'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/30 overflow-hidden mb-10">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-sky-500/10 via-emerald-500/10 to-teal-500/10 p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-sky-100 to-emerald-100">
                  {profile.photoURL ? (
                    <img 
                      src={profile.photoURL} 
                      alt={profile.fullName || 'Profile'} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center">
                            <span class="text-4xl font-bold text-sky-500">${getInitials()}</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-sky-500">{getInitials()}</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200">
                  <div className={`w-3 h-3 rounded-full ${profile.profileCompleted ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{profile.fullName || 'Your Name'}</h2>
                <p className="text-lg text-gray-600 mb-4">{profile.headline || 'Add a professional headline'}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-3">
                  {profile.location && (
                    <span className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-soft">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {profile.location}
                    </span>
                  )}
                  
                  {profile.experienceLevel && (
                    <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-sky-100 to-sky-50 text-sky-700 rounded-full text-sm font-medium shadow-soft">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {formatExperienceLevel(profile.experienceLevel)}
                    </span>
                  )}
                  
                  <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 rounded-full text-sm font-medium shadow-soft">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Job Seeker
                  </span>
                  
                  {profile.phone && (
                    <span className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {profile.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Contact & Files */}
              <div className="lg:col-span-1 space-y-6">
                {/* Contact Card */}
                <div className="bg-gradient-to-br from-sky-50/50 to-white rounded-2xl p-6 border border-sky-100/50 shadow-soft">
                  <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Contact Information
                  </h3>
                  
                  <div className="space-y-4">
                    {profile.phone && (
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <p className="font-medium text-gray-800">{profile.phone}</p>
                      </div>
                    )}
                    
                    {currentUser?.email && (
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="font-medium text-gray-800">{currentUser.email}</p>
                      </div>
                    )}
                    
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Member Since</p>
                      <p className="font-medium text-gray-800">
                        {formatDate(profile.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Files Card */}
                <div className="bg-gradient-to-br from-emerald-50/50 to-white rounded-2xl p-6 border border-emerald-100/50 shadow-soft">
                  <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Documents
                  </h3>
                  
                  {profile.resumeURL ? (
                    <>
                      <button
                        onClick={handleResumeDownload}
                        className="group w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl p-4 text-center hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-soft hover:shadow-lg transform hover:-translate-y-0.5 mb-4"
                      >
                        <div className="flex items-center justify-center mb-2">
                          <svg className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download Resume
                        </div>
                        <p className="text-xs opacity-90 truncate">
                          {profile.resumeFileName || 'Resume Document'}
                        </p>
                      </button>
                      <div className="text-xs text-gray-500 text-center">
                        Click to download your resume
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-xl">
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-gray-600 text-sm">No resume uploaded</p>
                      <button
                        onClick={() => navigate('/seeker/profile')}
                        className="mt-3 text-sm text-sky-600 hover:text-sky-700 font-medium"
                      >
                        Upload Resume
                      </button>
                    </div>
                  )}
                  
                  {!profile.photoURL && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => navigate('/seeker/profile')}
                        className="text-sm text-sky-600 hover:text-sky-700 font-medium flex items-center justify-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Add Profile Photo
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Skills & Education */}
              <div className="lg:col-span-2 space-y-8">
                {/* Skills Card */}
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-6 border border-gray-100/50 shadow-soft">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-100 to-amber-50 flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Skills & Expertise</h3>
                          <p className="text-gray-600 text-sm">Technical and professional skills</p>
                        </div>
                      </div>
                      <span className="text-sm px-3 py-1 bg-sky-100 text-sky-700 rounded-full">
                        {profile.skills.length} skills
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {profile.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-amber-100 text-amber-700 rounded-xl font-medium text-sm hover:bg-amber-50 transition-all duration-300 shadow-soft hover:shadow"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-8 border border-gray-100/50 shadow-soft text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Skills Added</h3>
                    <p className="text-gray-600 mb-4">Add skills to showcase your expertise</p>
                    <button
                      onClick={() => navigate('/seeker/profile')}
                      className="text-sky-600 hover:text-sky-700 font-medium"
                    >
                      Add Skills →
                    </button>
                  </div>
                )}

                {/* Education Card */}
                {profile.education && profile.education.length > 0 ? (
                  <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-6 border border-gray-100/50 shadow-soft">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-100 to-violet-50 flex items-center justify-center mr-4">
                          <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Education</h3>
                          <p className="text-gray-600 text-sm">Academic qualifications</p>
                        </div>
                      </div>
                      <span className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                        {profile.education.length} degrees
                      </span>
                    </div>
                    
                    <div className="space-y-5">
                      {profile.education.map((edu, index) => (
                        <div key={index} className="group bg-white/70 backdrop-blur-sm rounded-xl p-5 border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-lg">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div>
                              <div className="flex items-center mb-3">
                                <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 rounded-full text-xs font-semibold mr-3">
                                  {edu.level}
                                </span>
                                {edu.year && (
                                  <span className="text-sm text-gray-500">• {edu.year}</span>
                                )}
                              </div>
                              <h4 className="text-lg font-semibold text-gray-800 mb-1">{edu.institution}</h4>
                              {(edu.degree || edu.board) && (
                                <p className="text-gray-600">{edu.degree || edu.board}</p>
                              )}
                            </div>
                            {edu.percentage && (
                              <div className="mt-3 md:mt-0">
                                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 rounded-lg font-medium border border-emerald-100">
                                  <span className="text-lg font-bold mr-1">{edu.percentage}</span>
                                  <span className="text-sm">Score</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-8 border border-gray-100/50 shadow-soft text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                    </svg>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Education Added</h3>
                    <p className="text-gray-600 mb-4">Add your educational background</p>
                    <button
                      onClick={() => navigate('/seeker/profile')}
                      className="text-sky-600 hover:text-sky-700 font-medium"
                    >
                      Add Education →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Update Time */}
            <div className="mt-10 pt-8 border-t border-gray-200/50 text-center">
              <p className="text-sm text-gray-500">
                Last updated: {formatDate(profile.updatedAt || profile.lastProfileUpdate || profile.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-gradient-to-r from-sky-500/10 via-emerald-500/10 to-teal-500/10 rounded-3xl p-8 border border-white/30 backdrop-blur-sm">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 flex items-center justify-center mr-4 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Profile Tips</h3>
              <p className="text-gray-600">Maximize your job search success</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/30 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-sky-100 to-sky-50 flex items-center justify-center mb-4">
                <span className="text-sky-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Complete Your Profile</h4>
              <p className="text-sm text-gray-600">Add a professional photo and detailed work experience</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/30 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-50 flex items-center justify-center mb-4">
                <span className="text-emerald-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Update Skills</h4>
              <p className="text-sm text-gray-600">Keep your skills current with latest technologies</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/30 shadow-soft">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-100 to-amber-50 flex items-center justify-center mb-4">
                <span className="text-amber-600 font-bold">3</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Upload Resume</h4>
              <p className="text-sm text-gray-600">A current resume increases profile views by 60%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeekerProfileView;