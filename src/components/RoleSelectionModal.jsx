import { useState } from 'react';

export default function RoleSelectionModal({ isOpen, onSelect, onClose }) {
  const [selectedRole, setSelectedRole] = useState('seeker');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSelect(selectedRole);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="bg-white px-6 pt-6 pb-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-sky-100 mb-4">
                <svg className="h-6 w-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select Your Role
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Please choose how you'd like to use JobPortal
              </p>
            </div>

            {/* Role options */}
            <div className="space-y-4 mb-6">
              <button
                onClick={() => setSelectedRole('seeker')}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === 'seeker'
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    selectedRole === 'seeker' ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Job Seeker</div>
                    <div className="text-sm text-gray-500">Looking for job opportunities</div>
                  </div>
                  {selectedRole === 'seeker' && (
                    <div className="ml-auto">
                      <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setSelectedRole('employer')}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                  selectedRole === 'employer'
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    selectedRole === 'employer' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900">Employer</div>
                    <div className="text-sm text-gray-500">Looking to hire talent</div>
                  </div>
                  {selectedRole === 'employer' && (
                    <div className="ml-auto">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 rounded-xl transition-all duration-200 shadow-sm hover:shadow"
              >
                Continue as {selectedRole === 'seeker' ? 'Job Seeker' : 'Employer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

