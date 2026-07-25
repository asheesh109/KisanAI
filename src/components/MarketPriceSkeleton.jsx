export default function MarketPriceSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="p-4 sm:p-5 border rounded-xl animate-pulse"
        >
          <div className="flex justify-between mb-4">
            <div className="space-y-2 flex-1">
              <div className="h-5 w-32 bg-gray-300 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>

            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div>

          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
          </div>

          <div className="mt-5 flex justify-between">
            <div className="h-6 w-20 bg-gray-300 rounded"></div>
            <div className="h-6 w-14 bg-gray-300 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}