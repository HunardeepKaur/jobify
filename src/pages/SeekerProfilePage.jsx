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
    refreshProfileData, // ADD THIS
    loading: authLoading 
  } = useAuth();
  
  const { addToast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumePreview, setResumePreview] = useState('');
  const fileInputRef = useRef(null);
  
  // Skills state for managing individual skills
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState([]);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: '',
    headline: '',
    experienceLevel: '',
    resumeURL: '',
    resumeFileName: '',
    // Education fields
    tenthSchool: '',
    tenthBoard: '',
    tenthYear: '',
    tenthPercentage: '',
    twelfthSchool: '',
    twelfthBoard: '',
    twelfthYear: '',
    twelfthPercentage: '',
    graduationCollege: '',
    graduationDegree: '',
    graduationYear: '',
    graduationPercentage: '',
    otherEducation: ''
  });

  // Check if we're in edit mode (profile already exists)
  useEffect(() => {
    if (currentUser && profileData) {
      const hasProfileData = profileData.fullName || profileData.headline;
      setIsEditMode(profileCompleted || hasProfileData);
      console.log('Edit mode:', profileCompleted || hasProfileData, 'Profile data:', profileData);
    }
  }, [currentUser, profileData, profileCompleted]);

  // Load existing profile - UPDATED TO FIX ISSUE
  // Load existing profile
useEffect(() => {
  const loadProfile = async () => {
    console.log('Loading profile... Current user:', currentUser?.uid, 'Profile data:', profileData);
    
    if (currentUser && profileData) {
      try {
        // Load skills from profile data
        if (profileData.skills && Array.isArray(profileData.skills)) {
          setSkills(profileData.skills);
          console.log('Loaded skills:', profileData.skills);
        }
        
        // Load education data - NEW STRUCTURE
        if (profileData.education && Array.isArray(profileData.education)) {
          console.log('Loading education data:', profileData.education);
          
          // Initialize form data
          const newFormData = {
            fullName: profileData.fullName || '', // Use fullName here
            phone: profileData.phone || '',
            location: profileData.location || '',
            headline: profileData.headline || '',
            experienceLevel: profileData.experienceLevel || '',
            resumeURL: profileData.resumeURL || '',
            resumeFileName: profileData.resumeFileName || '',
            tenthSchool: '',
            tenthBoard: '',
            tenthYear: '',
            tenthPercentage: '',
            twelfthSchool: '',
            twelfthBoard: '',
            twelfthYear: '',
            twelfthPercentage: '',
            graduationCollege: '',
            graduationDegree: '',
            graduationYear: '',
            graduationPercentage: '',
            otherEducation: ''
          };
          
          profileData.education.forEach(edu => {
            console.log('Processing education item:', edu);
            
            switch(edu.level) {
              case '10th':
                newFormData.tenthSchool = edu.institution || '';
                newFormData.tenthBoard = edu.board || '';
                newFormData.tenthYear = edu.year || '';
                newFormData.tenthPercentage = edu.percentage || '';
                break;
                
              case '12th':
                newFormData.twelfthSchool = edu.institution || '';
                newFormData.twelfthBoard = edu.board || '';
                newFormData.twelfthYear = edu.year || '';
                newFormData.twelfthPercentage = edu.percentage || '';
                break;
                
              case 'Graduation':
                newFormData.graduationCollege = edu.institution || '';
                newFormData.graduationDegree = edu.degree || '';
                newFormData.graduationYear = edu.year || '';
                newFormData.graduationPercentage = edu.percentage || '';
                break;
                
              case 'Other':
                newFormData.otherEducation = edu.institution || '';
                break;
            }
          });
          
          setFormData(newFormData);
          console.log('Updated form data with education:', newFormData);
        } else {
          // Set basic profile data even if no education
          setFormData(prev => ({
            ...prev,
            fullName: profileData.fullName || '',
            phone: profileData.phone || '',
            location: profileData.location || '',
            headline: profileData.headline || '',
            experienceLevel: profileData.experienceLevel || '',
            resumeURL: profileData.resumeURL || '',
            resumeFileName: profileData.resumeFileName || ''
          }));
        }

        if (profileData.resumeFileName) {
          setResumePreview(profileData.resumeFileName);
        }
        
        console.log('Final form data after loading:', {
          fullName: profileData.fullName || '',
          phone: profileData.phone || '',
          location: profileData.location || '',
          headline: profileData.headline || '',
          experienceLevel: profileData.experienceLevel || ''
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile data');
        addToast('Error loading profile data', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      console.log('No profile data available yet');
      setLoading(false);
    }
  };
  
  loadProfile();
}, [currentUser, profileData]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!validTypes.includes(file.type)) {
        addToast('Please upload PDF or Word documents only', 'error');
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        addToast('File size should be less than 5MB', 'error');
        return;
      }
      
      console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
      setResumeFile(file);
      setResumePreview(file.name);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  // UPDATED: Handle submit with better error handling
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setSaving(true);
    setError('');

    try {
      console.log('Starting profile save...');
      console.log('Current skills:', skills);
      console.log('Form data:', formData);
      console.log('Resume file:', resumeFile);

      // Validate required fields
      if (!formData.fullName || !formData.headline || !formData.experienceLevel || skills.length === 0) {
        throw new Error('Please fill all required fields');
      }

      // Prepare education array from individual fields
      const educationArray = [];
      
      if (formData.tenthSchool.trim()) {
        educationArray.push({
          level: '10th',
          institution: formData.tenthSchool.trim(),
          board: formData.tenthBoard.trim(),
          year: formData.tenthYear.trim(),
          percentage: formData.tenthPercentage.trim()
        });
      }
      
      if (formData.twelfthSchool.trim()) {
        educationArray.push({
          level: '12th',
          institution: formData.twelfthSchool.trim(),
          board: formData.twelfthBoard.trim(),
          year: formData.twelfthYear.trim(),
          percentage: formData.twelfthPercentage.trim()
        });
      }
      
      if (formData.graduationCollege.trim()) {
        educationArray.push({
          level: 'Graduation',
          institution: formData.graduationCollege.trim(),
          degree: formData.graduationDegree.trim(),
          year: formData.graduationYear.trim(),
          percentage: formData.graduationPercentage.trim()
        });
      }
      
      if (formData.otherEducation.trim()) {
        educationArray.push({
          level: 'Other',
          institution: formData.otherEducation.trim()
        });
      }

      console.log('Education array prepared:', educationArray);

      // Prepare profile data
      const profileDataToSave = {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        location: formData.location.trim(),
        headline: formData.headline.trim(),
        skills: skills,
        experienceLevel: formData.experienceLevel,
        education: educationArray,
        resumeFileName: resumeFile ? resumeFile.name : formData.resumeFileName || ''
      };

      console.log('Profile data ready for saving:', profileDataToSave);

      // Save to Firebase
      const result = await updateSeekerProfile(currentUser.uid, profileDataToSave, resumeFile);
      console.log('Profile saved result:', result);

      // Update local state
      setProfileCompleted(true);
      
      // Refresh profile data immediately
      await refreshProfileData();
      
      // Show success message
      addToast(
        isEditMode ? '✅ Profile updated successfully!' : '✅ Profile completed successfully!', 
        'success'
      );
      
      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.message);
      addToast(`❌ ${error.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Reset form button
  const handleResetForm = () => {
    if (window.confirm('Are you sure you want to reset all fields?')) {
      setFormData({
        fullName: '',
        phone: '',
        location: '',
        headline: '',
        experienceLevel: '',
        resumeURL: '',
        resumeFileName: '',
        tenthSchool: '',
        tenthBoard: '',
        tenthYear: '',
        tenthPercentage: '',
        twelfthSchool: '',
        twelfthBoard: '',
        twelfthYear: '',
        twelfthPercentage: '',
        graduationCollege: '',
        graduationDegree: '',
        graduationYear: '',
        graduationPercentage: '',
        otherEducation: ''
      });
      setSkills([]);
      setResumeFile(null);
      setResumePreview('');
      setError('');
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? 'Edit Your Profile' : 'Complete Your Profile'}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isEditMode 
              ? 'Update your profile information to stand out to employers'
              : 'Complete your profile to start applying for amazing job opportunities'}
          </p>
          
          {/* Debug info - remove in production */}
          <div className="mt-4 text-sm text-gray-500">
            <p>User ID: {currentUser?.uid}</p>
            <p>Profile Completed: {profileCompleted ? 'Yes' : 'No'}</p>
            <p>Skills Count: {skills.length}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {profileCompleted && !isEditMode && (
          <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-700 font-medium">Profile already completed! You can update your information below.</p>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Personal Information */}
              <div className="bg-gradient-to-r from-sky-50 to-emerald-50 p-6 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h2>
                  {isEditMode && (
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="text-sm text-red-600 hover:text-red-700 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Reset Form
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                      placeholder="John Doe"
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                      placeholder="City, Country"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Headline *
                    </label>
                    <input
                      type="text"
                      name="headline"
                      value={formData.headline}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                      placeholder="e.g., Frontend Developer | React Specialist"
                    />
                  </div>
                </div>
              </div>
              
              {/* Skills Section */}
              <div className="bg-gradient-to-r from-sky-50 to-emerald-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Skills *
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Skills (One by One)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={handleSkillInputKeyDown}
                        placeholder="e.g., React"
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="px-6 py-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-colors font-medium"
                      >
                        Add
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Press Enter or click Add to add a skill. Add at least 1 skill.
                    </p>
                  </div>
                  
                  {/* Skills Display */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Your Skills ({skills.length})
                      {skills.length === 0 && (
                        <span className="ml-2 text-red-500 text-xs">(Add at least 1 skill)</span>
                      )}
                    </h3>
                    {skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full shadow-sm"
                          >
                            <span className="text-gray-800">{skill}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(index)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">No skills added yet. Add your first skill above.</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Experience Level */}
              <div className="bg-gradient-to-r from-sky-50 to-emerald-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Experience Level *
                </h2>
                
                <div>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    required
                    className="w-full max-w-md px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition bg-white"
                  >
                    <option value="">Select your experience level</option>
                    <option value="fresher">Fresher (0-1 year)</option>
                    <option value="entry">Entry Level (1-3 years)</option>
                    <option value="mid">Mid Level (3-7 years)</option>
                    <option value="senior">Senior Level (7+ years)</option>
                  </select>
                </div>
              </div>
              
              {/* Education Section */}
              <div className="bg-gradient-to-r from-sky-50 to-emerald-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" opacity="0.5" />
                  </svg>
                  Education
                </h2>
                
                <div className="space-y-8">
                  {/* 10th Standard */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700">10th Standard</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          School Name
                        </label>
                        <input
                          type="text"
                          name="tenthSchool"
                          value={formData.tenthSchool}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                          placeholder="Enter school name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Board
                        </label>
                        <input
                          type="text"
                          name="tenthBoard"
                          value={formData.tenthBoard}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                          placeholder="e.g., CBSE, ICSE, State Board"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Year of Passing
                        </label>
                        <input
                          type="text"
                          name="tenthYear"
                          value={formData.tenthYear}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                          placeholder="YYYY"
                          maxLength="4"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Percentage/CGPA
                        </label>
                        <input
                          type="text"
                          name="tenthPercentage"
                          value={formData.tenthPercentage}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                          placeholder="e.g., 85% or 8.5 CGPA"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* 12th Standard */}
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700">12th Standard</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          School/College Name
                        </label>
                        <input
                          type="text"
                          name="twelfthSchool"
                          value={formData.twelfthSchool}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                          placeholder="Enter school/college name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Board
                        </label>
                        <input
                          type="text"
                          name="twelfthBoard"
                          value={formData.twelfthBoard}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                          placeholder="e.g., CBSE, ICSE, State Board"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Year of Passing
                        </label>
                        <input
                          type="text"
                          name="twelfthYear"
                          value={formData.twelfthYear}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                          placeholder="YYYY"
                          maxLength="4"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Percentage/CGPA
                        </label>
                        <input
                          type="text"
                          name="twelfthPercentage"
                          value={formData.twelfthPercentage}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                          placeholder="e.g., 85% or 8.5 CGPA"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Graduation */}
                  <div className="space-y-4 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-700">Graduation</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          College/University
                        </label>
                        <input
                          type="text"
                          name="graduationCollege"
                          value={formData.graduationCollege}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                          placeholder="Enter college/university name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Degree
                        </label>
                        <input
                          type="text"
                          name="graduationDegree"
                          value={formData.graduationDegree}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                          placeholder="e.g., B.Tech, B.Sc, BA, B.Com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Year of Passing
                        </label>
                        <input
                          type="text"
                          name="graduationYear"
                          value={formData.graduationYear}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                          placeholder="YYYY"
                          maxLength="4"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Percentage/CGPA
                        </label>
                        <input
                          type="text"
                          name="graduationPercentage"
                          value={formData.graduationPercentage}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                          placeholder="e.g., 85% or 8.5 CGPA"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Other Education */}
                  <div className="pt-6 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Other Education/Certifications
                    </label>
                    <textarea
                      name="otherEducation"
                      value={formData.otherEducation}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition"
                      placeholder="Any other diplomas, certifications, or courses..."
                    />
                  </div>
                </div>
              </div>
              
              {/* Resume Upload */}
              <div className="bg-gradient-to-r from-sky-50 to-emerald-50 p-6 rounded-xl border border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Resume/CV
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Resume (Optional)
                  </label>
                  
                  {/* File Upload Area */}
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-sky-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                    />
                    
                    {resumePreview ? (
                      <div className="flex items-center justify-center">
                        <svg className="w-8 h-8 text-emerald-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{resumePreview}</p>
                          <p className="text-xs text-gray-500">Click to change file</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium text-sky-600">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX up to 5MB
                        </p>
                      </>
                    )}
                  </div>
                  
                  {/* Current Resume Link (if exists from previous URL upload) */}
                  {formData.resumeURL && !resumePreview && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Current resume: <a href={formData.resumeURL} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline">{formData.resumeFileName || 'View Resume'}</a>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Form Actions */}
              <div className="pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    disabled={saving}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={saving || skills.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-sky-500 to-emerald-500 text-white rounded-xl hover:from-sky-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow font-medium flex items-center justify-center"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {isEditMode ? 'Update Profile' : 'Save & Continue'}
                      </>
                    )}
                  </button>
                </div>
                
                <p className="text-sm text-gray-500 mt-4 text-center">
                  * Required fields
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Tips Card */}
        <div className="bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold">Profile Tips</h3>
          </div>
          <ul className="space-y-2 text-sky-100">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Add at least 5 relevant skills that match your target job roles</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-white rounded-full mt=2 mr-3 flex-shrink-0"></span>
              <span>Complete all education details - many employers filter candidates based on education</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 bg-white rounded-full mt-2 mr-3 flex-shrink-0"></span>
              <span>Uploading a resume increases your chances of getting shortlisted by 60%</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SeekerProfilePage;