const SkillsSkeleton = ({ count = 1 }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="h-6 bg-gray-300 rounded w-16 mb-4 animate-pulse"></div>

      <div className="space-y-3">
        {[...Array(count)].map((_, index) => (
          <div key={index} className="inline-block mr-2 mb-2">
            <div className="h-8 bg-blue-300 rounded-full w-32 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSkeleton;
