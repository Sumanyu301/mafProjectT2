const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-300 rounded-full animate-pulse" />
              {/* Text info */}
              <div className="flex flex-col min-w-0 flex-1">
                <div className="h-9 bg-gray-300 rounded w-24 mb-2 animate-pulse sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg" />
                <div className="h-6 bg-gray-300 rounded w-48 animate-pulse sm:max-w-xs md:max-w-sm lg:max-w-md xl:max-w-lg" />
              </div>
            </div>

            {/* Buttons area (can be skeleton blocks) */}
            <div className="hidden sm:flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
              <div className="h-10 bg-gray-300 rounded w-28 animate-pulse" />
              <div className="h-10 bg-gray-300 rounded w-20 animate-pulse" />
              <div className="h-10 bg-gray-300 rounded w-20 animate-pulse" />
            </div>
          </div>

          {/* Mobile buttons */}
          <div className="mt-4 flex flex-col gap-2 sm:hidden">
            <div className="h-10 bg-gray-300 rounded w-full animate-pulse" />
            <div className="h-10 bg-gray-300 rounded w-full animate-pulse" />
            <div className="h-10 bg-gray-300 rounded w-full animate-pulse" />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse" />
            {[1,2,3,4,5].map((_, i) => (
              <div key={i} className="space-y-2 mb-3">
                <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />
                <div className="h-5 bg-gray-300 rounded w-40 animate-pulse" />
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="h-6 bg-gray-300 rounded w-20 mb-4 animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="h-8 bg-gray-300 rounded w-8 mx-auto mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-300 rounded w-20 mx-auto animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="h-6 bg-gray-300 rounded w-16 mb-4 animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-300 rounded-full w-32 animate-pulse" />
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" />
                <div className="h-6 bg-gray-300 rounded w-32 animate-pulse" />
              </div>
              <div className="max-h-64 overflow-y-auto space-y-3">
                {[...Array(3)].map((__, j) => (
                  <div key={j} className="border border-gray-200 rounded-lg p-4 animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;

