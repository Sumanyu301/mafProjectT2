// components/LoadingOverlay.jsx
import React from "react";

const LoadingOverlay = ({ message = "Loading...", subMessage }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
      {/* Spinner */}
      <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-5"></div>
      
      {/* Main message */}
      <p className="text-blue-800 font-semibold text-lg">{message}</p>
      
      {/* Sub message */}
      {subMessage && (
        <p className="text-gray-500 text-sm mt-2">{subMessage}</p>
      )}
    </div>
  );
};

export default LoadingOverlay;
