// components/ProjectSkeleton.jsx
function ProjectSkeleton() {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg shadow-sm p-6 animate-pulse">
      {/* Title */}
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>

      {/* Description */}
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>

      {/* Status + Members */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-gray-200 rounded-full"></div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-4">
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
        <div className="h-4 w-16 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

export default ProjectSkeleton;
