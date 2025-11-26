const NewsSkeletonLoader = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
        >
          {/* Image Skeleton */}
          <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse"></div>

          {/* Content Skeleton */}
          <div className="p-6 space-y-4">
            {/* Tags Skeleton */}
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-6 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-6 bg-gray-300 rounded w-3/4 animate-pulse"></div>
            </div>

            {/* Summary Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>

            {/* Company Info Skeleton */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="space-y-1">
                  <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <div className="h-4 w-16 bg-gray-300 rounded animate-pulse ml-auto"></div>
                <div className="h-3 w-12 bg-gray-200 rounded animate-pulse ml-auto"></div>
              </div>
            </div>

            {/* Button Skeleton */}
            <div className="h-12 bg-gray-300 rounded-xl animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NewsSkeletonLoader;