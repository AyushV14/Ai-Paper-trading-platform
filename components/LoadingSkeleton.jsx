const LoadingSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="bg-gray-200 rounded-2xl h-40 animate-pulse"></div>
      
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-200 rounded-xl h-32 animate-pulse"></div>
        ))}
      </div>
      
      {/* Large Content Skeleton */}
      <div className="bg-gray-200 rounded-xl h-64 animate-pulse"></div>
      <div className="bg-gray-200 rounded-xl h-48 animate-pulse"></div>
      
      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-200 rounded-xl h-48 animate-pulse"></div>
        <div className="bg-gray-200 rounded-xl h-48 animate-pulse"></div>
      </div>
      
      {/* Footer Skeleton */}
      <div className="bg-gray-200 rounded-xl h-24 animate-pulse"></div>
    </div>
  );
};

export default LoadingSkeleton;