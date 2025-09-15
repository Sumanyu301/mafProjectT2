// Success Toast
export const SuccessToast = ({ title, message, onClose }) => (
  <div className="relative bg-white border border-green-200 text-blue-900 px-6 py-4 rounded-xl shadow-lg flex flex-col items-center justify-center w-[320px] animate-fade-in">
    {/* Cross button */}
    <button
      onClick={onClose}
      aria-label="Dismiss"
      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
      tabIndex={0}
    >
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l8 8M6 14L14 6"/>
      </svg>
    </button>
    <div className="w-10 h-10 flex items-center justify-center bg-green-600 rounded-full mb-3">
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
      </svg>
    </div>
    <p className="font-semibold text-lg">{title || "Success!"}</p>
    <p className="text-sm text-gray-600 text-center">{message}</p>
  </div>
);

// Error Toast
export const ErrorToast = ({ title, message, onClose }) => (
  <div className="relative bg-white border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-lg flex flex-col items-center justify-center w-[320px] animate-fade-in">
    {/* Cross button */}
    <button
      onClick={onClose}
      aria-label="Dismiss"
      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
      tabIndex={0}
    >
      <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l8 8M6 14L14 6"/>
      </svg>
    </button>
    <div className="w-10 h-10 flex items-center justify-center bg-red-600 rounded-full mb-3">
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </div>
    <p className="font-semibold text-lg">{title || "Error"}</p>
    <p className="text-sm text-gray-600 text-center">{message}</p>
  </div>
);

// Confirmation / Warning Toast
export const ConfirmToast = ({ title, message, onConfirm, onCancel }) => (
  <div className="bg-white border border-yellow-200 text-yellow-700 px-6 py-5 rounded-xl shadow-lg flex flex-col items-center justify-center w-[360px] animate-fade-in">
    <div className="w-10 h-10 flex items-center justify-center bg-yellow-500 rounded-full mb-3">
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14" />
      </svg>
    </div>
    <p className="font-semibold text-lg">{title || "Are you sure?"}</p>
    <p className="text-sm text-gray-600 mb-3 text-center">{message}</p>
    <div className="flex gap-3">
      <button
        onClick={onCancel}
        className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg transition"
      >
        Confirm
      </button>
    </div>
  </div>
);
