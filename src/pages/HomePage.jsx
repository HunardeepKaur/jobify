import React from 'react';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="text-center py-20 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Welcome to JobPortal
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          The simplest job portal to test Firebase authentication
        </p>
        
        {/* Firebase Status */}
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold mb-4">Firebase Status</h2>
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-600 font-medium">Firebase Connected</span>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex justify-center space-x-4">
          <a href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700">
            Test Login
          </a>
          <a href="/signup" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-blue-50">
            Test Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}

export default HomePage;

