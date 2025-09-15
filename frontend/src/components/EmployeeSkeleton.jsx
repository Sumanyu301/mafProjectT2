function EmployeeSkeleton() {
  const statsArray = [1, 2, 3];
  const skillsArray = Array.from({ length: 6 });

  return (
    <div className="min-h-screen bg-white relative overflow-hidden animate-pulse">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-50 rounded-full opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-red-50 rounded-full opacity-60"></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-blue-100 rounded-full opacity-40"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-8 py-8"> {/* constrained width with side margins */}
        {/* Header */}
        <div className="flex items-center space-x-8">
          {/* Profile Avatar */}
          <div className="w-28 h-28 bg-gray-300 rounded-full shadow-md"></div>
          <div className="flex-1 space-y-4 py-2">
            <div className="h-8 w-72 bg-gray-300 rounded"></div> {/* name */}
            <div className="h-5 w-64 bg-gray-200 rounded"></div> {/* email */}
            <div className="h-6 w-32 bg-gray-300 rounded-full mt-2"></div> {/* role */}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {statsArray.map((_, idx) => (
            <div
              key={idx}
              className="bg-white border p-6 rounded-2xl shadow-sm text-center space-y-4"
            >
              <div className="h-6 w-32 bg-gray-300 rounded mx-auto"></div> {/* stat title */}
              <div className="h-10 w-20 bg-gray-300 rounded mx-auto"></div> {/* stat number */}
            </div>
          ))}
        </div>

        {/* About Section */}
        <div className="bg-white border rounded-2xl p-8 mt-10 shadow-sm space-y-4">
          <div className="h-6 w-48 bg-gray-300 rounded"></div> {/* About heading */}
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
          <div className="h-4 w-56 bg-gray-200 rounded"></div>
          <div className="flex flex-wrap gap-3 mt-4">
            {skillsArray.map((_, idx) => (
              <div key={idx} className="h-6 w-20 bg-gray-300 rounded-full"></div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          <div className="bg-white border rounded-2xl p-8 shadow-sm space-y-4">
            <div className="h-6 w-48 bg-gray-300 rounded"></div> {/* chart title */}
            <div className="h-32 bg-gray-200 rounded"></div> {/* chart placeholder */}
          </div>
          <div className="bg-white border rounded-2xl p-8 shadow-sm space-y-4">
            <div className="h-6 w-56 bg-gray-300 rounded"></div> {/* chart title */}
            <div className="h-32 bg-gray-200 rounded"></div> {/* chart placeholder */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeSkeleton;
