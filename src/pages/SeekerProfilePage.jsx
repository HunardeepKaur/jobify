import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateSeekerProfile } from '../firebase/profile';
import { useToast } from '../components/ToastContext';

function SeekerProfilePage() {
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
  const [activeSection, setActiveSection] = useState('personal');

  // File states
  const [resumeFile, setResumeFile] = useState(null);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [resumePreview, setResumePreview] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');

  // Refs
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);

  // Skills state
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);

  // Education arrays
  const [educationItems, setEducationItems] = useState([
    { level: '10th', institution: '', board: '', year: '', percentage: '', id: 1 },
    { level: '12th', institution: '', board: '', year: '', percentage: '', id: 2 },
    { level: 'Graduation', institution: '', degree: '', year: '', percentage: '', id: 3 }
  ]);

  // Form data state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    headline: '',
    experienceLevel: '',
    resumeURL: '',
    resumeFileName: '',
    photoURL: '',
    photoFileName: '',
  });

  // Check edit mode
  useEffect(() => {
    if (currentUser && profileData) {
      const hasProfileData = profileData.fullName || profileData.headline;
      setIsEditMode(profileCompleted || hasProfileData);
    }
  }, [currentUser, profileData, profileCompleted]);

  // Load existing profile
  useEffect(() => {
    const loadProfile = () => {
      console.log('Loading profile... Current user:', currentUser?.uid, 'Profile data:', profileData);
      if (currentUser && profileData) {
        try {
          // Load skills
          if (profileData.skills && Array.isArray(profileData.skills)) {
            setSkills(profileData.skills);
          }
          // Load photo URL if exists
          if (profileData.photoURL) {
            setPhotoPreview(profileData.photoURL);
          }
          // Load resume preview
          if (profileData.resumeFileName) {
            setResumePreview(profileData.resumeFileName);
          }
          // Set form data with proper fallbacks
          setFormData({
            fullName: profileData.fullName || '',
            phone: profileData.phone || '',
            location: profileData.location || '',
            headline: profileData.headline || '',
            experienceLevel: profileData.experienceLevel || '',
            resumeURL: profileData.resumeURL || '',
            resumeFileName: profileData.resumeFileName || '',
            photoURL: profileData.photoURL || '',
            photoFileName: profileData.photoFileName || '',
          });
          // Load education data into educationItems
          if (profileData.education && Array.isArray(profileData.education)) {
            const updatedEducationItems = [...educationItems];
            profileData.education.forEach(edu => {
              const index = educationItems.findIndex(item => item.level === edu.level);
              if (index !== -1) {
                updatedEducationItems[index] = {
                  ...updatedEducationItems[index],
                  institution: edu.institution || '',
                  board: edu.board || '',
                  degree: edu.degree || '',
                  year: edu.year || '',
                  percentage: edu.percentage || ''
                };
              }
            });
            setEducationItems(updatedEducationItems);
          }
        } catch (error) {
          console.error('Error loading profile:', error);
          setError('Failed to load profile data');
          addToast('Error loading profile data', 'error');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    loadProfile();
  }, [currentUser, profileData]);

  // Handle resume file selection
  const handleResumeFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!validTypes.includes(file.type)) {
        addToast('Please upload PDF or Word documents only', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        addToast('File size should be less than 5MB', 'error');
        return;
      }
      setResumeFile(file);
      setResumePreview(file.name);
    }
  };

  // Handle profile photo selection
  const handlePhotoFileChange = (e) => {
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
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setProfilePhotoFile(file);
    }
  };

  // Remove profile photo
  const handleRemovePhoto = () => {
    setProfilePhotoFile(null);
    setPhotoPreview(formData.photoURL || '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle education change
  const handleEducationChange = (id, field, value) => {
    setEducationItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Skills management
  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSkillInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Handle Next button click
  const handleNextClick = () => {
    const sections = ['personal', 'skills', 'education'];
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex < sections.length - 1) {
      setActiveSection(sections[currentIndex + 1]);
    }
  };

  // Handle Previous button click
  const handlePreviousClick = () => {
    const sections = ['personal', 'skills', 'education'];
    const currentIndex = sections.indexOf(activeSection);
    if (currentIndex > 0) {
      setActiveSection(sections[currentIndex - 1]);
    }
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    const fields = [
      formData.fullName,
      formData.headline,
      formData.experienceLevel,
      skills.length > 0,
      educationItems.some(item => item.institution.trim()),
      photoPreview,
      resumePreview
    ];
    const completed = fields.filter(Boolean).length;
    return Math.round((completed / fields.length) * 100);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔒 Only allow submission from Education tab
    if (activeSection !== 'education') {
      addToast('Please complete all sections before saving', 'error');
      return;
    }

    if (!currentUser) return;
    setSaving(true);
    setError('');

    try {
      console.log('Starting profile save...');
      console.log('Current formData:', formData);

      const validationErrors = [];
      if (!formData.fullName?.trim()) validationErrors.push('Full name is required');
      if (!formData.headline?.trim()) validationErrors.push('Professional headline is required');
      if (!formData.experienceLevel) validationErrors.push('Experience level is required');
      if (skills.length === 0) validationErrors.push('At least one skill is required');
      const hasEducation = educationItems.some(item => item.institution.trim());
      if (!hasEducation) validationErrors.push('At least one education entry is required');
      if (!photoPreview) validationErrors.push('Profile photo is required');
      if (!resumePreview) validationErrors.push('Resume is required');

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      const educationArray = educationItems
        .filter(item => item.institution?.trim())
        .map(item => {
          const baseData = { level: item.level, institution: item.institution.trim() };
          if (item.year?.trim()) baseData.year = item.year.trim();
          if (item.percentage?.trim()) baseData.percentage = item.percentage.trim();
          if (item.level === 'Graduation' && item.degree?.trim()) {
            baseData.degree = item.degree.trim();
          } else if (item.board?.trim()) {
            baseData.board = item.board.trim();
          }
          return baseData;
        });

      const profileDataToSave = {
        fullName: formData.fullName.trim(),
        phone: formData.phone?.trim() || '',
        location: formData.location?.trim() || '',
        headline: formData.headline.trim(),
        skills: skills,
        experienceLevel: formData.experienceLevel,
        education: educationArray,
        resumeURL: formData.resumeURL || '',
        resumeFileName: formData.resumeFileName || '',
        resumeStoragePath: profileData?.resumeStoragePath || '',
        photoURL: formData.photoURL || '',
        photoFileName: formData.photoFileName || '',
        photoStoragePath: profileData?.photoStoragePath || ''
      };

      console.log('Profile data ready for saving:', profileDataToSave);

      const result = await updateSeekerProfile(
        currentUser.uid,
        profileDataToSave,
        resumeFile,
        profilePhotoFile
      );

      console.log('Profile saved result:', result);
      setProfileCompleted(true);
      await refreshProfileData();
      addToast(
        isEditMode ? '✅ Profile updated successfully!' : '✅ Profile completed successfully!',
        'success'
      );
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.message);
      addToast(`❌ ${error.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isEditMode ? 'Edit Your Profile' : 'Complete Your Profile'}
              </h1>
              <p className="text-gray-600">
                {isEditMode
                  ? 'Update your professional information to attract employers'
                  : 'Fill in your details to start applying for amazing opportunities'}
              </p>
            </div>
            {/* Progress */}
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Profile Completion</div>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mr-3">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${calculateCompletion()}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold text-gray-900">{calculateCompletion()}%</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-white rounded-xl border border-gray-200 p-1 mb-8 shadow-sm">
            {[
              { id: 'personal', label: 'Personal Info', icon: '👤' },
              { id: 'skills', label: 'Skills', icon: '⚡' },
              { id: 'education', label: 'Education', icon: '🎓' }
            ].map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center space-x-2 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-sky-50 to-emerald-50 text-sky-600 border border-sky-100 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
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
          {/* Left Column - Profile Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-sky-100 to-emerald-100">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => photoInputRef.current.click()}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-white border border-gray-300 text-gray-700 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <input
                    type="file"
                    ref={photoInputRef}
                    onChange={handlePhotoFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {formData.fullName || 'Your Name'}
                </h2>
                <p className="text-gray-600 text-sm mb-4 text-center">
                  {formData.headline || 'Your Professional Headline'}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-sky-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-sky-600">{skills.length}</div>
                    <div className="text-xs text-gray-600">Skills</div>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {formData.experienceLevel ? '✓' : '0'}
                    </div>
                    <div className="text-xs text-gray-600">Experience</div>
                  </div>
                </div>

                {/* Resume Upload */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">
                      Resume <span className="text-red-500">*</span>
                    </h3>
                    {resumePreview && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="text-xs text-sky-600 hover:text-sky-700"
                      >
                        Change
                      </button>
                    )}
                  </div>
                  {resumePreview ? (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-700 truncate">{resumePreview}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="w-full text-sm text-gray-600 hover:text-sky-600 flex items-center justify-center py-2 border border-dashed border-gray-300 rounded-lg hover:border-sky-300 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload Resume (Required)
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleResumeFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Completion Tips */}
            <div className="bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl p-5 text-white">
              <h3 className="font-semibold mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Profile Tips
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-white rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                  <span>Profile photo and resume are required</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-white rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                  <span>Add 5-10 relevant skills for your field</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-white rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                  <span>Complete all education entries</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Main Form */}
          <div className="lg:col-span-2">
            {/* ⚠️ Added onKeyDown to prevent Enter-triggered submits */}
            <form
              onSubmit={handleSubmit}
              id="profileForm"
              className="space-y-6"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                  e.preventDefault();
                }
              }}
            >
              {/* Personal Information Section */}
              {activeSection === 'personal' && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center mr-3">
                      <span className="text-sky-600 text-lg">👤</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                      <p className="text-gray-600 text-sm">Tell us about yourself</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Professional Headline <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="headline"
                        value={formData.headline}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                        placeholder="Senior Software Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                        placeholder="San Francisco, CA"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition bg-white"
                      >
                        <option value="">Select your experience level</option>
                        <option value="fresher">Fresher (0-1 year)</option>
                        <option value="entry">Entry Level (1-3 years)</option>
                        <option value="mid">Mid Level (3-7 years)</option>
                        <option value="senior">Senior Level (7+ years)</option>
                        <option value="executive">Executive Level</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Section */}
              {activeSection === 'skills' && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center mr-3">
                      <span className="text-sky-600 text-lg">⚡</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Skills & Expertise</h2>
                      <p className="text-gray-600 text-sm">Add your professional skills</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add Skills <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={handleSkillInputKeyDown}
                          placeholder="Type a skill and press Enter"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
                        />
                        <button
                          type="button"
                          onClick={handleAddSkill}
                          className="px-6 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors font-medium"
                        >
                          Add Skill
                        </button>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-gray-700">
                          Your Skills ({skills.length})
                        </h3>
                        {skills.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setSkills([])}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                      {skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, index) => (
                            <div
                              key={index}
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-200 px-4 py-2 rounded-lg"
                            >
                              <span className="text-sm text-sky-800">{skill}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(index)}
                                className="text-sky-400 hover:text-red-500 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          <p className="text-gray-500">No skills added yet</p>
                          <p className="text-sm text-gray-400 mt-1">Add your first skill above</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Education Section */}
              {activeSection === 'education' && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center mr-3">
                      <span className="text-sky-600 text-lg">🎓</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Education</h2>
                      <p className="text-gray-600 text-sm">Add your educational background</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {educationItems.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-xl p-5 bg-gradient-to-r from-sky-50/50 to-emerald-50/50">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-medium text-gray-900">{item.level}</h3>
                          {item.institution && (
                            <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded">✓ Added</span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {item.level === 'Graduation' ? (
                            <>
                              <div>
                                <label className="block text-sm text-gray-600 mb-2">College/University</label>
                                <input
                                  type="text"
                                  value={item.institution}
                                  onChange={(e) => handleEducationChange(item.id, 'institution', e.target.value)}
                                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent"
                                  placeholder="Enter college name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-gray-600 mb-2">Degree</label>
                                <input
                                  type="text"
                                  value={item.degree}
                                  onChange={(e) => handleEducationChange(item.id, 'degree', e.target.value)}
                                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent"
                                  placeholder="e.g., B.Tech Computer Science"
                                />
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <label className="block text-sm text-gray-600 mb-2">School Name</label>
                                <input
                                  type="text"
                                  value={item.institution}
                                  onChange={(e) => handleEducationChange(item.id, 'institution', e.target.value)}
                                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent"
                                  placeholder="Enter school name"
                                />
                              </div>
                              <div>
                                <label className="block text-sm text-gray-600 mb-2">Board</label>
                                <input
                                  type="text"
                                  value={item.board}
                                  onChange={(e) => handleEducationChange(item.id, 'board', e.target.value)}
                                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent"
                                  placeholder="e.g., CBSE, ICSE"
                                />
                              </div>
                            </>
                          )}
                          <div>
                            <label className="block text-sm text-gray-600 mb-2">Year of Passing</label>
                            <input
                              type="text"
                              value={item.year}
                              onChange={(e) => handleEducationChange(item.id, 'year', e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent"
                              placeholder="YYYY"
                              maxLength="4"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-2">Percentage/CGPA</label>
                            <input
                              type="text"
                              value={item.percentage}
                              onChange={(e) => handleEducationChange(item.id, 'percentage', e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent"
                              placeholder="e.g., 85% or 8.5"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </form>

            {/* Navigation Buttons (OUTSIDE the form) */}
            <div className="flex justify-between pt-6 border-t border-gray-200 mt-6">
              <div className="flex space-x-3">
                {activeSection !== 'personal' && (
                  <button
                    type="button"
                    onClick={handlePreviousClick}
                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
              </div>
              <div className="flex space-x-3">
                {activeSection !== 'education' ? (
                  <button
                    type="button"
                    onClick={handleNextClick}
                    className="px-5 py-2.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    form="profileForm"
                    disabled={saving || skills.length === 0 || !photoPreview || !resumePreview}
                    className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-lg hover:from-sky-600 hover:to-emerald-600 disabled:opacity-50 transition-all font-medium shadow-sm hover:shadow"
                  >
                    {saving ? (
                      <span className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </span>
                    ) : isEditMode ? 'Update Profile' : 'Save Profile'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeekerProfilePage;