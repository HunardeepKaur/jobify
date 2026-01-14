import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateCompanyProfile } from '../firebase/company';
import { useToast } from '../components/ToastContext';

function CompanyProfilePage() {
  const {
    currentUser,
    profileCompleted,
    setProfileCompleted,
    profileData,
    refreshProfileData,
    loading: authLoading
  } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // File states
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  // Refs
  const logoInputRef = useRef(null);

  // Company sizes and industries (simplified)
  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-500 employees',
    '500+ employees'
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Manufacturing',
    'Other'
  ];

  // Form data state - SIMPLIFIED
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    industry: '',
    companySize: '',
    location: '',
    companyWebsite: ''
  });

  // Check edit mode
  useEffect(() => {
    if (currentUser && profileData) {
      const hasCompanyData = profileData.companyName || profileData.industry;
      setIsEditMode(profileCompleted || hasCompanyData);
    }
  }, [currentUser, profileData, profileCompleted]);

  // Load existing profile
  useEffect(() => {
    const loadProfile = () => {
      if (currentUser && profileData) {
        try {
          // Load logo
          if (profileData.logoURL) {
            setLogoPreview(profileData.logoURL);
          }
          
          // Set form data
          setFormData({
            companyName: profileData.companyName || '',
            companyEmail: profileData.companyEmail || '',
            industry: profileData.industry || '',
            companySize: profileData.companySize || '',
            location: profileData.location || '',
            companyWebsite: profileData.companyWebsite || ''
          });
        } catch (error) {
          console.error('Error loading company profile:', error);
          setError('Failed to load company data');
          addToast('Error loading company data', 'error');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    loadProfile();
  }, [currentUser, profileData]);

  // Handle logo file change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        addToast('Please upload JPEG, PNG, or WebP images only', 'error');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        addToast('Image size should be less than 2MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setLogoFile(file);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    const fields = [
      formData.companyName,
      formData.companyEmail,
      formData.industry,
      formData.companySize,
      formData.location,
      logoPreview
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) return;
    setSaving(true);
    setError('');

    try {
      const validationErrors = [];
      if (!formData.companyName?.trim()) validationErrors.push('Company name is required');
      if (!formData.companyEmail?.trim()) validationErrors.push('Company email is required');
      if (!formData.industry) validationErrors.push('Industry is required');
      if (!formData.companySize) validationErrors.push('Company size is required');
      if (!formData.location?.trim()) validationErrors.push('Location is required');
      if (!logoPreview) validationErrors.push('Company logo is required');

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const result = await updateCompanyProfile(
        currentUser.uid,
        formData,
        logoFile
      );

      setProfileCompleted(true);
      await refreshProfileData();
      addToast(
        isEditMode ? '✅ Company profile updated!' : '✅ Profile completed!',
        'success'
      );
      setTimeout(() => navigate('/employer/dashboard'), 1500);
    } catch (error) {
      console.error('Error saving company profile:', error);
      setError(error.message);
      addToast(`❌ ${error.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-sky-500 rounded-2xl mb-6 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {isEditMode ? 'Update Company Profile' : 'Setup Your Company'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isEditMode
              ? 'Update your company information'
              : 'Complete your company profile to start hiring'}
          </p>
          
          {/* Progress Bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Profile Progress</span>
              <span className="font-semibold">{calculateCompletion()}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${calculateCompletion()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Logo & Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Logo Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-emerald-100 to-sky-100">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Company Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => logoInputRef.current.click()}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-white border border-gray-300 text-gray-700 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    </svg>
                  </button>
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Company Logo</h3>
                <p className="text-xs text-gray-500 text-center">Required • JPG, PNG, WebP • Max 2MB</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {formData.industry ? '✓' : '0'}
                </div>
                <div className="text-xs text-gray-600 mt-1">Industry Set</div>
              </div>
              <div className="bg-gradient-to-br from-sky-50 to-sky-100/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-sky-600">
                  {formData.companySize ? '✓' : '0'}
                </div>
                <div className="text-xs text-gray-600 mt-1">Size Set</div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-sky-500/10 rounded-2xl p-5 border border-emerald-100/50">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quick Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                  <span>All fields are required except website</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-sky-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                  <span>Logo helps build trust with candidates</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Main Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                  e.preventDefault();
                }
              }}
            >
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      placeholder="Enter company name"
                    />
                  </div>

                  {/* Company Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="companyEmail"
                      value={formData.companyEmail}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      placeholder="contact@company.com"
                    />
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white"
                    >
                      <option value="">Select Industry</option>
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </select>
                  </div>

                  {/* Company Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Size <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition bg-white"
                    >
                      <option value="">Select Company Size</option>
                      {companySizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      placeholder="City, State"
                    />
                  </div>

                  {/* Website (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Website
                    </label>
                    <input
                      type="url"
                      name="companyWebsite"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      placeholder="https://company.com"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={saving || calculateCompletion() < 100}
                  className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-sky-500 text-white rounded-xl hover:from-emerald-600 hover:to-sky-600 disabled:opacity-50 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {saving ? (
                    <span className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </span>
                  ) : isEditMode ? 'Update Profile' : 'Complete Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyProfilePage;