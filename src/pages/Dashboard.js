import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { currentUser, userRole, profileCompleted } = useAuth();
  
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please login to view dashboard</h1>
          <Link to="/login" className="text-sky-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser.email}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your job search today.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profile Status</p>
                <p className="text-2xl font-bold mt-1">
                  {profileCompleted ? 'Complete' : 'Incomplete'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                profileCompleted 
                  ? 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-600' 
                  : 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-600'
              }`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            {!profileCompleted && (
              <Link 
                to="/seeker/profile" 
                className="mt-4 inline-block text-sm text-sky-600 hover:text-sky-700 font-medium"
              >
                Complete Profile →
              </Link>
            )}
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Account Type</p>
                <p className="text-2xl font-bold mt-1">
                  {userRole === 'seeker' ? 'Job Seeker' : 'Employer'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                userRole === 'seeker' 
                  ? 'bg-gradient-to-r from-sky-100 to-sky-50 text-sky-600' 
                  : 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-600'
              }`}>
                {userRole === 'seeker' ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-medium text-gray-800 mt-1 truncate">
                  {currentUser.email}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gray-100 to-gray-50 text-gray-600 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              to="/seeker/profile"
              className="p-6 border border-gray-200 rounded-xl hover:border-sky-300 hover:bg-sky-50 transition-all duration-200 group"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-sky-100 to-sky-50 text-sky-600 rounded-lg flex items-center justify-center mr-3 group-hover:from-sky-200 group-hover:to-sky-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Edit Profile</h3>
              </div>
              <p className="text-sm text-gray-600">Update your personal and professional information</p>
            </Link>
            
            <Link 
              to="/jobs"
              className="p-6 border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 group"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mr-3 group-hover:from-emerald-200 group-hover:to-emerald-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Browse Jobs</h3>
              </div>
              <p className="text-sm text-gray-600">Discover new job opportunities matching your skills</p>
            </Link>
            
            <div className="p-6 border border-gray-200 rounded-xl bg-gray-50">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Applications</h3>
              </div>
              <p className="text-sm text-gray-600">Complete your profile to start applying for jobs</p>
            </div>
          </div>
        </div>
        
        {/* Coming Soon */}
        <div className="bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold">Coming Soon</h3>
          </div>
          <p className="text-sky-100 mb-4">
            We're working on bringing you more features to enhance your job search experience.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <h4 className="font-semibold mb-2">Smart Job Matching</h4>
              <p className="text-sm text-sky-100">Get personalized job recommendations based on your profile</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <h4 className="font-semibold mb-2">Application Tracking</h4>
              <p className="text-sm text-sky-100">Track all your job applications in one place</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;