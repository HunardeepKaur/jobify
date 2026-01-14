import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [activeRole, setActiveRole] = useState('seeker');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    
    // Auto-switch between roles for demo effect
    const interval = setInterval(() => {
      setActiveRole(prev => prev === 'seeker' ? 'employer' : 'seeker');
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-sky-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s infinite ease-in-out ${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10">
       

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12 pb-24">
          <div className="text-center mb-16">
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 transition-all duration-700 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="bg-gradient-to-r from-sky-600 via-emerald-500 to-sky-600 bg-clip-text text-transparent bg-size-200 animate-gradient">
                Where Talent Meets
              </span>
              <br />
              <span className="text-gray-800">Opportunity</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              The modern platform connecting ambitious job seekers with innovative companies.
              Build your future with us.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            {/* Job Seeker Card */}
            <div 
              className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${
                activeRole === 'seeker' 
                  ? 'border-sky-500 shadow-xl scale-105' 
                  : 'border-gray-100 hover:border-sky-200'
              }`}
              onMouseEnter={() => setActiveRole('seeker')}
              onClick={() => setActiveRole('seeker')}
            >
              {activeRole === 'seeker' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
                    Recommended for you
                  </div>
                </div>
              )}
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-sky-100 to-emerald-100 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Job Seeker</h3>
                  <p className="text-gray-600">Looking for opportunities</p>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Create professional profile',
                  'Browse thousands of jobs',
                  'One-click applications',
                  'Track applications in real-time',
                  'Get matched with ideal roles'
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="block w-full bg-gradient-to-r from-sky-500 to-emerald-500 text-white text-center py-3.5 rounded-xl font-medium hover:from-sky-600 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Find Your Dream Job
              </Link>
            </div>

            {/* Employer Card */}
            <div 
              className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-500 transform hover:-translate-y-2 cursor-pointer ${
                activeRole === 'employer' 
                  ? 'border-emerald-500 shadow-xl scale-105' 
                  : 'border-gray-100 hover:border-emerald-200'
              }`}
              onMouseEnter={() => setActiveRole('employer')}
              onClick={() => setActiveRole('employer')}
            >
              {activeRole === 'employer' && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-emerald-500 to-sky-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
                    Hiring made easy
                  </div>
                </div>
              )}
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-sky-100 rounded-2xl flex items-center justify-center mr-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Employer</h3>
                  <p className="text-gray-600">Looking for talent</p>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Register your company',
                  'Post unlimited job openings',
                  'Access qualified candidates',
                  'Streamlined hiring process',
                  'Advanced candidate filtering'
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-sky-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="block w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-white text-center py-3.5 rounded-xl font-medium hover:from-emerald-600 hover:to-sky-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Start Hiring Now
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                10K+
              </div>
              <div className="text-gray-700 font-medium">Active Jobs</div>
              <div className="text-sm text-gray-500 mt-2">Updated daily</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <div className="text-gray-700 font-medium">Companies</div>
              <div className="text-sm text-gray-500 mt-2">From startups to Fortune 500</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300">
              <div className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                95%
              </div>
              <div className="text-gray-700 font-medium">Success Rate</div>
              <div className="text-sm text-gray-500 mt-2">Successful placements</div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-sky-500/10 to-emerald-500/10 backdrop-blur-sm rounded-3xl p-12 text-center border border-white/20 shadow-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to Transform Your Career Journey?
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands who've found their perfect match through JobPortal
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link
                  to="/signup"
                  className="group relative bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-10 py-4 rounded-xl font-bold text-lg overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  to="/login"
                  className="group border-2 border-sky-500 text-sky-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-sky-50 transition-all duration-300"
                >
                  Already have an account?
                </Link>
              </div>
              <p className="text-gray-500 text-sm mt-8">
                No credit card required • Free forever plan available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default HomePage;