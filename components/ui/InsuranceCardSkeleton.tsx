export default function InsuranceCardSkeleton() {
  return (
    <div className="animate-pulse bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-lg p-6 border border-white/30 dark:border-white/10">
      <div className="h-44 bg-gray-200 dark:bg-gray-800 rounded-xl mb-4"></div>
      <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
      </div>
      <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-full"></div>
    </div>
  );
}
