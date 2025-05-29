const ClockSkeleton = () => {
  const pairs = Array.from({ length: 4 }).map((_, pairIdx) => [
    pairIdx * 2,
    pairIdx * 2 + 1,
  ]);
  return (
    <div className="flex flex-col items-center animate-pulse">
      <p className="text-lg font-semibold mb-2">Ink Runs Dry In</p>
      <div
        className="flex gap-8 justify-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
        aria-hidden="true"
      >
        {pairs.map((pair, idx) => (
          <div key={idx} className="flex gap-2">
            {pair.map((cardIdx) => (
              <div key={cardIdx} className="flex flex-col items-center gap-1">
                <div className="w-12 h-16 sm:w-14 sm:h-18 md:w-16 md:h-20 bg-white/10 rounded-lg" />
                <div className="w-10 h-4 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClockSkeleton;
