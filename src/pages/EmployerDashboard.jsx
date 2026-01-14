import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function EmployerDashboard() {
  const { currentUser, profileCompleted } = useAuth();
  
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <div className="w-16 h-16 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please login to access your dashboard</p>
          <Link 
            to="/login" 
            className="inline-block bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-medium hover:from-sky-600 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Welcome, Hiring Manager!
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your company and find top talent
          </p>
        </div>

        {/* Company Status Card */}
        <div className={`rounded-2xl shadow-lg p-6 mb-8 transition-all duration-300 ${
          profileCompleted 
            ? 'bg-gradient-to-r from-emerald-50 to-white border border-emerald-100' 
            : 'bg-gradient-to-r from-amber-50 to-white border border-amber-100'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 ${
                  profileCompleted 
                    ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-600' 
                    : 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-600'
                }`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {profileCompleted ? 'Company Profile Complete!' : 'Set Up Your Company'}
                </h3>
              </div>
              <p className="text-gray-600">
                {profileCompleted 
                  ? 'Your company profile is ready to attract candidates' 
                  : 'Complete your company profile to start posting jobs'}
              </p>
            </div>
            {!profileCompleted && (
              <Link 
                to="/company/profile" 
                className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white px-6 py-3 rounded-xl font-medium hover:from-emerald-600 hover:to-sky-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Setup Company
              </Link>
            )}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Company Profile Card */}
          <Link 
            to="/company/profile"
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600">Company Profile</h3>
                <p className="text-sm text-gray-600">Edit company information and branding</p>
              </div>
            </div>
          </Link>

          {/* View Company Profile Card */}
          <Link 
            to="/company/profile/view"
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:border-sky-300 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-100 to-sky-50 text-sky-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-sky-600">View Profile</h3>
                <p className="text-sm text-gray-600">See how candidates view your company</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Coming Soon Features */}
        <div className="bg-gradient-to-r from-emerald-500 to-sky-500 rounded-2xl shadow-lg p-8 text-white mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-bold">Coming Soon for Employers</h3>
            </div>
            <p className="text-emerald-100 mb-6">Exciting features to enhance your hiring process</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
                <h4 className="font-semibold mb-2">Post Jobs</h4>
                <p className="text-sm text-emerald-100">Create and manage job postings</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-left">
                <h4 className="font-semibold mb-2">View Applicants</h4>
                <p className="text-sm text-emerald-100">Browse and manage job applications</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info */}
        
      </div>
    </div>
  );
}

export default EmployerDashboard;