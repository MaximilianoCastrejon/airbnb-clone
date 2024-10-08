const LoadingSkeleton_HostBookings = () => {
  return (
    <div className="grid max-[1120px]:grid-cols-3 grid-cols-4 gap-4">
      {Array(3)
        .fill(null)
        .map((_, idx) => (
          <div key={idx} className="p-4 border border-neutral-300 rounded-lg">
            <div className="animate-pulse">
              <div>
                <div className="h-4 bg-neutral-300 rounded mb-2 w-1/3"></div>
                <div className="h-4 bg-neutral-300 rounded mb-2 w-1/3"></div>
                <div className="h-4 block"></div>
                <div className="h-4 bg-neutral-300 rounded mb-2 w-1/6"></div>
                <div className="h-4 bg-neutral-300 rounded mb-2 w-1/3"></div>
                <div className="h-4 block"></div>
              </div>
              <div className="border-b border-gray-200 w-full"></div>
              <div className="animate-pulse">
                <div className="h-4 bg-neutral-300 mx-auto mt-4 w-1/3"></div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default LoadingSkeleton_HostBookings;
