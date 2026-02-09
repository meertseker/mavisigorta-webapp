export default function BlogCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Image placeholder */}
      <div className="h-56 bg-gray-200"></div>
      
      <div className="p-6">
        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-3">
          <div className="h-5 bg-gray-200 rounded w-20"></div>
          <div className="h-5 bg-gray-200 rounded w-24"></div>
        </div>
        
        {/* Title */}
        <div className="h-7 bg-gray-200 rounded w-4/5 mb-3"></div>
        
        {/* Excerpt lines */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        {/* Read more link */}
        <div className="h-5 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
}
