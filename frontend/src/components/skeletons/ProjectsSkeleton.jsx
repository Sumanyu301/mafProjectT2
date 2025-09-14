import React from "react";

const ProjectCardSkeleton = ({ showTeamMember = false }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
        </div>
        <div className="flex items-center gap-2 ml-3">
          <div className="h-6 bg-yellow-300 rounded-full w-20"></div>
          <div className="h-4 w-4 bg-gray-300 rounded"></div>
        </div>
      </div>
      {showTeamMember ? (
        <div className="flex justify-between items-center mt-2">
          <div className="h-3 bg-gray-300 rounded w-20"></div>
          <div className="h-3 bg-blue-300 rounded w-16"></div>
        </div>
      ) : (
        <div className="h-3 bg-gray-300 rounded w-24 mt-2"></div>
      )}
    </div>
  );
};

const ProjectsSkeleton = ({
  title = "Projects",
  dotColor = "purple",
  count = 1,
  showTeamMember = false,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-2 h-2 bg-${dotColor}-300 rounded-full animate-pulse`}
        ></div>
        <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
      </div>
      <div className="space-y-3">
        {[...Array(count)].map((_, index) => (
          <ProjectCardSkeleton key={index} showTeamMember={showTeamMember} />
        ))}
      </div>
    </div>
  );
};

export default ProjectsSkeleton;
export { ProjectCardSkeleton };
