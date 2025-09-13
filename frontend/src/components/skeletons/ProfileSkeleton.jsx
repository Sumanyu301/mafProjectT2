import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              {/* Avatar with initials */}
              <div className="w-16 h-16 bg-gray-300 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-8 h-4 bg-gray-400 rounded animate-pulse"></div>
              </div>
              <div>
                <div className="h-9 bg-gray-300 rounded w-24 mb-2 animate-pulse"></div>
                <div className="h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
              </div>
            </div>
            {/* Edit/Save/Cancel buttons */}
            <div className="flex gap-2">
              <div className="h-10 bg-green-300 rounded w-28 animate-pulse"></div>
              <div className="h-10 bg-gray-300 rounded w-20 animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
            <div className="space-y-4">
              <div>
                <div className="h-4 bg-gray-300 rounded w-12 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-300 rounded w-16 animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-12 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-300 rounded w-40 animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-16 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-300 rounded w-40 animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-20 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-300 rounded w-4 animate-pulse"></div>
              </div>
              <div>
                <div className="h-4 bg-gray-300 rounded w-32 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-300 rounded w-4 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 bg-gray-300 rounded w-20 mb-4 animate-pulse"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="h-8 bg-blue-300 rounded w-8 mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-20 mx-auto animate-pulse"></div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="h-8 bg-green-300 rounded w-8 mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-16 mx-auto animate-pulse"></div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="h-8 bg-purple-300 rounded w-8 mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-24 mx-auto animate-pulse"></div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="h-8 bg-orange-300 rounded w-8 mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-24 mx-auto animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="h-6 bg-gray-300 rounded w-16 mb-4 animate-pulse"></div>
          <div className="flex flex-wrap gap-2">
            <div className="h-8 bg-blue-300 rounded-full w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Owned Projects */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="h-5 bg-gray-300 rounded w-32 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-300 rounded w-full mb-1 animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <div className="h-6 bg-yellow-300 rounded-full w-20 animate-pulse"></div>
                    <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="h-3 bg-gray-300 rounded w-24 mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Working On */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-orange-300 rounded-full animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-24 animate-pulse"></div>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-3">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="h-5 bg-gray-300 rounded w-20 mb-2 animate-pulse"></div>
                      <div className="h-4 bg-gray-300 rounded w-full mb-1 animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      <div className="h-6 bg-yellow-300 rounded-full w-20 animate-pulse"></div>
                      <div className="h-4 w-4 bg-gray-300 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
                    <div className="h-3 bg-blue-300 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
