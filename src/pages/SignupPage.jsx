import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupWithEmail, loginWithGoogle } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ToastContext';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('seeker');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { isAuthenticated} = useAuth();
  const { addToast } = useToast();

  

  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Sign up with Firebase Auth & create Firestore document
      
  await signupWithEmail(email, password, userType);
  
  addToast(
    `Account created successfully! Please login with your credentials.`,
    'success'
  );
  
  // REDIRECT TO LOGIN PAGE, NOT PROFILE
  setTimeout(() => {
    navigate('/login'); // Changed from '/seeker/profile'
  }, 1500);
      
    } catch (error) {
      console.error('Signup error:', error);
      
      let errorMessage = error.message;
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists. Please login.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      }
      
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    try {
      // For Google signup, use the selected userType
      await loginWithGoogle(userType);
      addToast(
        `Google signup successful! You are now a ${userType === 'seeker' ? 'Job Seeker' : 'Employer'}.`,
        'success'
      );
      
      setTimeout(() => {
        navigate(userType === 'seeker' ? '/seeker/profile' : '/company/profile');
      }, 1000);
    } catch (error) {
      console.error('Google signup error:', error);
      
      let errorMessage = error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Google signup was cancelled.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by browser. Please allow popups for this site.';
      }
      
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {/* Decorative Background Shapes */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-sky-100 rounded-full opacity-50 mix-blend-multiply blur-xl"></div>
      <div className="absolute bottom-10 left-10 w-64 h-64 bg-emerald-100 rounded-full opacity-50 mix-blend-multiply blur-xl"></div>
      
      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-emerald-500 px-8 py-8">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white text-center">Join JobPortal</h1>
            <p className="text-sky-100 text-center mt-1">Create your account</p>
          </div>
          
          <div className="p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100 flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}
            
            {/* User Type Selection - Minimal */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-3 text-sm font-medium">I am a:</label>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setUserType('seeker')}
                  disabled={loading}
                  className={`flex-1 py-3.5 rounded-xl border-2 font-medium transition-all duration-200 ${
                    userType === 'seeker'
                      ? 'border-sky-500 bg-sky-50 text-sky-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-center">
                    <svg className={`w-5 h-5 mr-2 ${userType === 'seeker' ? 'text-sky-600' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span>Job Seeker</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('employer')}
                  disabled={loading}
                  className={`flex-1 py-3.5 rounded-xl border-2 font-medium transition-all duration-200 ${
                    userType === 'employer'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-center">
                    <svg className={`w-5 h-5 mr-2 ${userType === 'employer' ? 'text-emerald-600' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                    <span>Employer</span>
                  </div>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {userType === 'seeker' 
                  ? 'Looking for job opportunities' 
                  : 'Looking to hire talent'}
              </p>
            </div>
            
            {/* Google Signup Button */}
            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full flex items-center justify-center bg-white text-gray-700 border border-gray-200 rounded-xl py-3.5 px-4 mb-6 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all duration-200 shadow-sm hover:shadow"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-sky-500 rounded-full animate-spin mr-2"></div>
                  Loading...
                </span>
              ) : (
                <>
                  <img 
                    src="https://www.google.com/favicon.ico" 
                    alt="Google" 
                    className="w-5 h-5 mr-3"
                  />
                  <span className="font-medium">Sign up with Google</span>
                </>
              )}
            </button>
            
            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or sign up with email</span>
              </div>
            </div>
            
            {/* Email/Password Form */}
            <form onSubmit={handleEmailSignup}>
              <div className="mb-5">
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent disabled:opacity-50 transition placeholder-gray-400"
                  placeholder="you@example.com"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent disabled:opacity-50 transition placeholder-gray-400"
                  placeholder="At least 6 characters"
                  minLength="6"
                  required
                />
                <div className="flex items-center mt-2">
                  <div className={`w-2 h-2 rounded-full mr-2 ${password.length >= 6 ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                  <p className="text-xs text-gray-500">Minimum 6 characters</p>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-3.5 rounded-xl font-medium hover:from-sky-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </span>
                ) : 'Create Account'}
              </button>
            </form>
            
            {/* Login Link */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-center text-gray-600 text-sm">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-sky-600 hover:text-sky-800 font-medium hover:underline"
                >
                  Login
                </Link>
              </p>
              
              <p className="text-center text-gray-500 text-xs mt-4">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-sky-600 hover:underline">Terms</a>
                {' '}and{' '}
                <a href="#" className="text-sky-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">Start your journey with JobPortal today</p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;