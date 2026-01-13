import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function SeekerProfileView() {
  const { profileData, currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileData) {
      console.log('Profile Data Received:', profileData); // Debug log
      setProfile(profileData);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [profileData]);

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
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Profile Found</h2>
            <p className="text-gray-600 mb-6">You haven't created your profile yet.</p>
            <button
              onClick={() => navigate('/seeker/profile')}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl hover:from-sky-600 hover:to-emerald-600 transition-colors font-medium"
            >
              Create Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format experience level for better display
  const formatExperienceLevel = (level) => {
    const levels = {
      'fresher': 'Fresher (0-1 year)',
      'entry': 'Entry Level (1-3 years)',
      'mid': 'Mid Level (3-7 years)',
      'senior': 'Senior Level (7+ years)'
    };
    return levels[level] || level;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-gray-600">View your professional profile</p>
            </div>
            <button
              onClick={() => navigate('/seeker/profile')}
              className="px-6 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl hover:from-sky-600 hover:to-emerald-600 transition-colors font-medium flex items-center shadow-sm hover:shadow"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Card - More Aesthetic Design */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          {/* Profile Header - Gradient Background */}
          <div className="relative bg-gradient-to-r from-sky-500 via-emerald-500 to-teal-500 p-8 text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-start md:items-center">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center mr-6 mb-6 md:mb-0 shadow-lg">
                  <span className="text-3xl font-bold text-white">
                    {profile.fullName?.charAt(0).toUpperCase() || currentUser?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                {/* Profile Info */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{profile.fullName || 'No Name'}</h2>
                  <p className="text-lg text-white/90 mb-3">{profile.headline || 'No Headline'}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-3 mt-4">
                    <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      Job Seeker
                    </div>
                    
                    {profile.location && (
                      <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {profile.location}
                      </div>
                    )}
                    
                    {profile.experienceLevel && (
                      <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {formatExperienceLevel(profile.experienceLevel)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Contact & Basic Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Contact Info Card */}
                <div className="bg-gradient-to-br from-sky-50 to-white rounded-2xl p-6 border border-sky-100 shadow-sm">
                  <div className="flex items-center mb-5">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-sky-100 to-sky-50 flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {profile.phone && (
                      <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <p className="font-medium text-gray-800">{profile.phone}</p>
                      </div>
                    )}
                    
                    {currentUser?.email && (
                      <div className="bg-white rounded-xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="font-medium text-gray-800">{currentUser.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Resume Card */}
                {profile.resumeURL && (
                  <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
                    <div className="flex items-center mb-5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-100 to-emerald-50 flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">Resume</h3>
                    </div>
                    
                    <a 
                      href={profile.resumeURL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl p-4 text-center hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-sm hover:shadow"
                    >
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Resume
                      </div>
                      <p className="text-xs mt-2 opacity-90">{profile.resumeFileName || 'PDF Document'}</p>
                    </a>
                  </div>
                )}
              </div>

              {/* Right Column - Skills & Education */}
              <div className="lg:col-span-2 space-y-8">
                {/* Skills Card */}
                {profile.skills && profile.skills.length > 0 && (
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-100 to-amber-50 flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Skills & Expertise</h3>
                        <p className="text-gray-600 text-sm">Technical and professional skills</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      {profile.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="px-4 py-2.5 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 text-amber-700 rounded-xl font-medium text-sm hover:from-amber-100 hover:to-yellow-100 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{profile.skills.length} skills</span>
                        <span className="text-xs px-3 py-1 bg-sky-100 text-sky-700 rounded-full">
                          Updated Recently
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Education Card */}
                {profile.education && profile.education.length > 0 && (
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-100 to-violet-50 flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">Education</h3>
                        <p className="text-gray-600 text-sm">Academic qualifications and achievements</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {profile.education.map((edu, index) => (
                        <div key={index} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:shadow-md">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                            <div>
                              <div className="flex items-center mb-2">
                                <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 rounded-full text-xs font-semibold mr-3">
                                  {edu.level}
                                </span>
                                {edu.year && (
                                  <span className="text-sm text-gray-500">{edu.year}</span>
                                )}
                              </div>
                              <h4 className="text-lg font-semibold text-gray-800">{edu.institution}</h4>
                              {edu.degree && (
                                <p className="text-gray-600 mt-1">{edu.degree}</p>
                              )}
                            </div>
                            <div className="mt-3 md:mt-0">
                              {edu.percentage && (
                                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg font-medium">
                                  <span className="text-lg font-bold mr-1">{edu.percentage}</span>
                                  <span className="text-sm">Score</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                            {edu.board && (
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Board/University</p>
                                <p className="font-medium text-gray-800">{edu.board}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                      <button
                        onClick={() => navigate('/seeker/profile')}
                        className="inline-flex items-center text-sky-600 hover:text-sky-700 font-medium"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add More Education Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Stats */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-sky-600 mb-1">{profile.skills?.length || 0}</div>
                  <p className="text-sm text-gray-600">Skills</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-emerald-600 mb-1">{profile.education?.length || 0}</div>
                  <p className="text-sm text-gray-600">Qualifications</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-purple-600 mb-1">100%</div>
                  <p className="text-sm text-gray-600">Profile Complete</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-amber-600 mb-1">
                    {profile.profileUpdatedAt ? 'Updated' : 'Just Now'}
                  </div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                </div>
              </div>
            </div>

            {/* Action Buttons at Bottom */}
            <div className="mt-12 pt-8 border-t border-gray-200 flex justify-center">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/seeker/profile')}
                  className="px-8 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl hover:from-sky-600 hover:to-emerald-600 transition-all duration-300 font-medium flex items-center shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-medium flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold">Profile Tips</h3>
              <p className="text-sky-100 text-sm">Maximize your job search success</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-3">
                <span className="text-sky-600 font-bold">1</span>
              </div>
              <p className="text-sm">Add your latest projects to showcase your work</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-3">
                <span className="text-sky-600 font-bold">2</span>
              </div>
              <p className="text-sm">Keep your skills updated with current technologies</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-3">
                <span className="text-sky-600 font-bold">3</span>
              </div>
              <p className="text-sm">A professional photo increases profile views by 40%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeekerProfileView;