export default function CourseCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
      
      {/* Title */}
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
      
      {/* Description lines */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      
      {/* Price */}
      <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
      
      {/* Button */}
      <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
    </div>
  );
}
