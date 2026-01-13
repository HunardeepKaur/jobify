// components/RoleSelectionModal.jsx
export function RoleSelectionModal({ isOpen, onSelect, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div className="relative transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all w-full max-w-md">
          {/* Modal header */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-2">
              Select Your Role
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Please choose how you want to use JobPortal
            </p>
          </div>
          
          {/* Role selection buttons */}
          <div className="space-y-4">
            <button
              onClick={() => onSelect('seeker')}
              className="w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-sky-500 hover:bg-sky-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Job Seeker</h4>
                  <p className="text-sm text-gray-500">Looking for job opportunities</p>
                </div>
              </div>
            </button>
            
            <button
              onClick={() => onSelect('employer')}
              className="w-full p-4 text-left border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Employer</h4>
                  <p className="text-sm text-gray-500">Looking to hire talent</p>
                </div>
              </div>
            </button>
          </div>

          {/* Cancel button */}
          <div className="mt-6">
            <button
              type="button"
              className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoleSelectionModal;