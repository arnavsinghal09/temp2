interface LoadingSkeletonProps {
  type: "hero" | "row" | "card"
}

export default function LoadingSkeleton({ type }: LoadingSkeletonProps) {
  if (type === "hero") {
    return (
      <div className="h-[85vh] min-h-[700px] bg-gray-800 animate-pulse">
        <div className="flex items-center h-full px-8 md:px-16">
          <div className="max-w-3xl space-y-6">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="h-20 bg-gray-700 rounded w-2/3"></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="flex space-x-4">
              <div className="h-12 bg-gray-700 rounded w-32"></div>
              <div className="h-12 bg-gray-700 rounded w-12"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === "row") {
    return (
      <div className="mb-12 px-8 md:px-16">
        <div className="h-8 bg-gray-800 rounded w-48 mb-6 animate-pulse"></div>
        <div className="flex space-x-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-[320px] aspect-[16/9] bg-gray-800 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return <div className="w-[320px] aspect-[16/9] bg-gray-800 rounded animate-pulse"></div>
}
