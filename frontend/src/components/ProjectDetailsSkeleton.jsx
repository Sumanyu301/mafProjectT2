// components/ProjectDetailsSkeleton.jsx
function ProjectDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="px-16 py-8 max-w-full mx-auto"> {/* Full width container with extra padding */}
        {/* Back Button */}
        <div className="flex items-center text-blue-900 mb-6">
          <div className="h-6 w-6 bg-gray-300 rounded mr-3"></div>
          <div className="h-6 w-48 bg-gray-300 rounded"></div> {/* wider */}
        </div>

        {/* Project Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 mb-10">
          <div className="h-10 w-4/5 bg-gray-300 rounded mb-5"></div> {/* wider title */}
          <div className="h-6 w-full bg-gray-200 rounded mb-3"></div>
          <div className="h-6 w-11/12 bg-gray-200 rounded mb-8"></div>

          {/* Status + Priority */}
          <div className="flex flex-wrap gap-4 my-6">
            <div className="h-6 w-32 bg-gray-300 rounded-full"></div>
            <div className="h-6 w-40 bg-gray-300 rounded-full"></div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
            <div className="w-full h-4 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Project Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center mb-3">
                <div className="h-5 w-6 bg-gray-300 rounded mr-3"></div>
                <div className="h-5 w-32 bg-gray-200 rounded"></div> {/* wider */}
              </div>
              <div className="h-6 w-40 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>

        {/* Team Members */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 mb-10">
          <div className="flex justify-between items-center mb-8">
            <div className="h-6 w-48 bg-gray-300 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-6 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gray-300 rounded-full mr-4"></div>
                  <div>
                    <div className="h-5 w-40 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Actions */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <div className="h-6 w-48 bg-gray-300 rounded mb-6"></div>
          <div className="flex gap-6">
            <div className="h-12 w-40 bg-gray-300 rounded"></div>
            <div className="h-12 w-48 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailsSkeleton;
