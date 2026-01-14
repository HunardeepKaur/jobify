import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function SeekerDashboard() {
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
            Welcome back, Job Seeker!
          </h1>
          <p className="text-gray-600 text-lg">
            Let's find your next opportunity
          </p>
        </div>

        {/* Profile Status Card */}
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
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {profileCompleted ? 'Profile Complete!' : 'Complete Your Profile'}
                </h3>
              </div>
              <p className="text-gray-600">
                {profileCompleted 
                  ? 'Your profile is ready for employers to see' 
                  : 'Complete your profile to start applying for jobs'}
              </p>
            </div>
            {!profileCompleted && (
              <Link 
                to="/seeker/profile" 
                className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-medium hover:from-sky-600 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Complete Profile
              </Link>
            )}
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Profile Card */}
          <Link 
            to="/seeker/profile"
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:border-sky-300 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-100 to-sky-50 text-sky-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-sky-600">Edit Profile</h3>
                <p className="text-sm text-gray-600">Update your personal information</p>
              </div>
            </div>
          </Link>

          {/* View Profile Card */}
          <Link 
            to="/seeker/profile/view"
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:border-emerald-300 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 group-hover:text-emerald-600">View Profile</h3>
                <p className="text-sm text-gray-600">See how employers view your profile</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl shadow-lg p-8 text-white mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">Ready for your next role?</div>
            <p className="text-sky-100 mb-6">Complete your profile to unlock job applications</p>
            {!profileCompleted && (
              <Link 
                to="/seeker/profile"
                className="inline-block bg-white text-sky-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Complete Profile Now
              </Link>
            )}
            {profileCompleted && (
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Profile Ready - You can apply for jobs!</span>
              </div>
            )}
          </div>
        </div>

        
      </div>
    </div>
  );
}

export default SeekerDashboard;