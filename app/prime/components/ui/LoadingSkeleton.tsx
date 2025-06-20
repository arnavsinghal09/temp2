interface LoadingSkeletonProps {
  type: "hero" | "row" | "card"
}

export default function LoadingSkeleton({ type }: LoadingSkeletonProps) {
  if (type === "hero") {
    return (
      <div className="relative h-[85vh] min-h-[700px] bg-gray-800 animate-pulse rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700"></div>
        <div className="relative z-10 flex items-center h-full px-8 md:px-16">
          <div className="max-w-3xl space-y-4">
            <div className="h-8 bg-gray-700 rounded w-3/4"></div>
            <div className="h-20 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-12 bg-gray-700 rounded w-48"></div>
          </div>
        </div>
      </div>
    )
  }

  if (type === "row") {
    return (
      <div className="mb-12">
        <div className="px-8 md:px-16 mb-6">
          <div className="h-8 bg-gray-800 rounded w-64 animate-pulse"></div>
        </div>
        <div className="flex space-x-4 px-8 md:px-16">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-[320px] aspect-[16/9] bg-gray-800 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (type === "card") {
    return (
      <div className="w-[320px] aspect-[16/9] bg-gray-800 rounded-lg animate-pulse"></div>
    )
  }

  return null
}
