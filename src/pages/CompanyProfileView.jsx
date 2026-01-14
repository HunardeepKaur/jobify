import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastContext';

function CompanyProfileView() {
  const { profileData, currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileData) {
      setCompany(profileData);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [profileData]);

  // Get initials for avatar
  const getInitials = () => {
    if (company?.companyName) {
      return company.companyName.charAt(0).toUpperCase();
    }
    return 'C';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company profile...</p>
        </div>
      </div>
    );
  }

  if (!company || !company.companyName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 py-12 px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft p-10 text-center border border-white/30">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-sky-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft">
              <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Company Profile Found</h2>
            <p className="text-gray-600 mb-8">Setup your company profile to start hiring</p>
            <button
              onClick={() => navigate('/company/profile')}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-sky-500 text-white rounded-xl hover:from-emerald-600 hover:to-sky-600 transition-all duration-300 font-medium shadow-soft hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Create Company Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div className="mb-6 sm:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Profile</h1>
              <p className="text-gray-600">Your company information</p>
            </div>
            <button
              onClick={() => navigate('/company/profile')}
              className="group px-6 py-3 bg-gradient-to-r from-emerald-500 to-sky-500 text-white rounded-xl hover:from-emerald-600 hover:to-sky-600 transition-all duration-300 font-medium shadow-sm hover:shadow-lg flex items-center transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-soft border border-white/30 overflow-hidden">
          {/* Company Header */}
          <div className="relative bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-teal-500/10 p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Company Logo */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gradient-to-br from-emerald-100 to-sky-100">
                  {company.logoURL ? (
                    <img 
                      src={company.logoURL} 
                      alt={company.companyName} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `
                          <div class="w-full h-full flex items-center justify-center">
                            <span class="text-3xl font-bold text-emerald-500">${getInitials()}</span>
                          </div>
                        `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-emerald-500">{getInitials()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{company.companyName}</h2>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {company.industry && (
                    <span className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 shadow-soft">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {company.industry}
                    </span>
                  )}
                  
                  {company.companySize && (
                    <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 rounded-full text-sm font-medium shadow-soft">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {company.companySize}
                    </span>
                  )}
                  
                  {company.location && (
                    <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-sky-100 to-sky-50 text-sky-700 rounded-full text-sm font-medium shadow-soft">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {company.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-emerald-50/50 to-white rounded-2xl p-6 border border-emerald-100/50 shadow-soft">
                  <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Contact Information
                  </h3>
                  
                  <div className="space-y-4">
                    {company.companyEmail && (
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="font-medium text-gray-800">{company.companyEmail}</p>
                      </div>
                    )}
                    
                    {currentUser?.email && (
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Account Email</p>
                        <p className="font-medium text-gray-800">{currentUser.email}</p>
                      </div>
                    )}
                    
                    {company.companyWebsite && (
                      <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Website</p>
                        <a 
                          href={company.companyWebsite}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-sky-600 hover:text-sky-700"
                        >
                          {company.companyWebsite}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Company Stats */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-sky-50/50 to-white rounded-2xl p-6 border border-sky-100/50 shadow-soft">
                  <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
                    <svg className="w-5 h-5 text-sky-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Company Stats
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 text-center">
                      <div className="text-2xl font-bold text-emerald-600">
                        {company.industry ? '✓' : '–'}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Industry</p>
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 text-center">
                      <div className="text-2xl font-bold text-sky-600">
                        {company.companySize ? '✓' : '–'}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Size</p>
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 text-center">
                      <div className="text-2xl font-bold text-amber-600">
                        {company.location ? '✓' : '–'}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Location</p>
                    </div>
                    
                    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-100 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {company.logoURL ? '✓' : '–'}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Logo</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyProfileView;