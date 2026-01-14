import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { ToastProvider } from '../src/components/ToastContext';
import SeekerProfilePage from './pages/SeekerProfilePage';
import Dashboard from './pages/Dashboard';
import SeekerProfileView from './pages/SeekerProfileView';



// Simple Forgot Password Page
const ForgotPasswordPage = () => (
  <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-md w-full">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
        <p className="text-gray-600 mt-2">
          Enter your email to receive a password reset link.
        </p>
      </div>
      
      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            type="email"
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent"
            placeholder="you@example.com"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white py-3 rounded-xl font-medium hover:from-sky-600 hover:to-emerald-600 transition-all duration-200 shadow-sm hover:shadow"
        >
          Send Reset Link
        </button>
      </form>
      
      <div className="mt-6 pt-6 border-t border-gray-100">
        <a 
          href="/login" 
          className="block text-center text-sky-600 hover:text-sky-800 font-medium hover:underline"
        >
          ← Back to Login
        </a>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/seeker/profile" element={<SeekerProfilePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/seeker/profile/view" element={<SeekerProfileView />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;