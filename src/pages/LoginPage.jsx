import { useNavigate, Link } from 'react-router-dom';
import { loginWithGoogle, loginWithEmail } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import RoleSelectionModal from '../components/RoleSelectionModal'; // Changed from named import to default import

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGoogleLogin = async (role) => {
    setError('');
    setLoading(true);
    
    try {
      await loginWithGoogle(role);
      
      setToastMessage('✅ Login successful! Redirecting...');
      
      // Redirect to dashboard
      setTimeout(() => navigate('/dashboard'), 1000);
      
    } catch (error) {
      console.error('Google login failed:', error);
      
      let errorMessage = error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Google login was cancelled.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by browser. Please allow popups for this site.';
      }
      
      setError(errorMessage);
      setToastMessage(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setToastMessage('');

    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Login with email/password
      await loginWithEmail(email, password);
      
      setToastMessage('✅ Login successful! Redirecting...');
      
      // Redirect to dashboard
      setTimeout(() => navigate('/dashboard'), 1000);
      
    } catch (error) {
      console.error('Login failed:', error);
      
      // User-friendly error messages
      let errorMessage = error.message;
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
      }
      
      setError(errorMessage);
      setToastMessage(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center p-4">
        {/* Toast Message */}
        {toastMessage && (
          <div className="fixed top-4 right-4 z-40 bg-white border border-gray-200 rounded-xl shadow-lg p-4 max-w-sm">
            <div className="flex items-center">
              <span className="mr-2">{toastMessage.includes('✅') ? '✅' : '❌'}</span>
              <span className="text-sm font-medium text-gray-900">
                {toastMessage.replace('✅ ', '').replace('❌ ', '')}
              </span>
              <button 
                onClick={() => setToastMessage('')}
                className="ml-4 text-gray-400 hover:text-gray-500"
              >
                ×
              </button>
            </div>
          </div>
        )}
        
        {/* Decorative Background Shapes */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-sky-100 rounded-full opacity-50 mix-blend-multiply blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-emerald-100 rounded-full opacity-50 mix-blend-multiply blur-xl"></div>
        
        <div className="relative w-full max-w-md">
          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-sky-500 to-emerald-500 px-8 py-8">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white text-center">Welcome Back</h1>
              <p className="text-sky-100 text-center mt-1">Login to your account</p>
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
              
              {/* Google Login Button */}
              <button
                onClick={() => setShowRoleModal(true)}
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
                    <span className="font-medium">Continue with Google</span>
                  </>
                )}
              </button>
              
              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or login with email</span>
                </div>
              </div>
              
              {/* Email/Password Form */}
              <form onSubmit={handleEmailLogin}>
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
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700 text-sm font-medium">
                      Password
                    </label>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-sky-600 hover:text-sky-800 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent disabled:opacity-50 transition placeholder-gray-400"
                    placeholder="••••••••"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-3.5 rounded-xl font-medium hover:from-sky-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Logging in...
                    </span>
                  ) : 'Login'}
                </button>
              </form>
              
              {/* Signup Link */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-center text-gray-600 text-sm">
                  Don't have an account?{' '}
                  <Link 
                    to="/signup" 
                    className="text-sky-600 hover:text-sky-800 font-medium hover:underline"
                  >
                    Create an account
                  </Link>
                </p>
                
                <p className="text-center text-gray-500 text-xs mt-4">
                  By logging in, you agree to our{' '}
                  <a href="#" className="text-sky-600 hover:underline">Terms</a>
                  {' '}and{' '}
                  <a href="#" className="text-sky-600 hover:underline">Privacy Policy</a>
                </p>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">JobPortal • Connect talent with opportunity</p>
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      <RoleSelectionModal
        isOpen={showRoleModal}
        onSelect={(role) => {
          setShowRoleModal(false);
          handleGoogleLogin(role);
        }}
        onClose={() => {
          setShowRoleModal(false);
          setLoading(false);
        }}
      />
    </>
  );
}

export default LoginPage;