// components/ProjectSkeleton.jsx
function ProjectSkeleton() {
  return (
    <div className="cursor-pointer bg-white border-2 border-gray-200 rounded-lg shadow-sm p-6 animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          {/* Title */}
          <div className="h-7 bg-gray-300 rounded w-32 mb-1"></div>
          {/* Status and Priority badges */}
          <div className="mt-1 flex items-center gap-2">
            <div className="h-5 bg-gray-300 rounded-full w-16 px-2 py-0.5"></div>
            <div className="h-5 bg-gray-300 rounded-full w-12 px-2 py-0.5"></div>
          </div>
        </div>
        {/* Arrow icon */}
        <div className="h-5 w-5 bg-gray-300 rounded"></div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>

      {/* Meta Row */}
      <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
        <div className="flex items-center text-gray-600 space-x-4">
          <div className="flex items-center text-xs text-gray-500">
            <div className="h-4 w-4 bg-gray-300 rounded mr-1"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <div className="h-4 w-4 bg-gray-300 rounded mr-1"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <div className="h-4 w-4 bg-gray-300 rounded mr-1"></div>
            <div className="h-3 bg-gray-300 rounded w-12"></div>
          </div>
        </div>

        <div className="flex items-center text-gray-600">
          <div className="h-4 w-4 bg-gray-300 rounded mr-1"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <div className="h-4 bg-gray-300 rounded w-16"></div>
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-300 rounded w-8"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="h-2 bg-gray-300 rounded-full w-1/2"></div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center text-gray-500">
          <div className="h-4 w-4 bg-gray-300 rounded mr-1"></div>
          <div className="h-3 bg-gray-300 rounded w-20"></div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </div>
    </div>
  );
}

export default ProjectSkeleton;
