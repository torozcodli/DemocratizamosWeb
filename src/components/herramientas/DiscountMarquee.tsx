export function DiscountMarquee() {
  const repetitions = 15; // Número de repeticiones para efecto continuo

  return (
    <div className="w-full bg-[#E68956] overflow-hidden isolate py-3 sm:py-4 my-0 border-y border-[#E68956]/20">
      <div className="flex whitespace-nowrap">
        <div className="flex animate-marquee text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
          {Array.from({ length: repetitions }).map((_, index) => (
            <span key={index} className="inline-block mx-2 sm:mx-3 text-white">
              HERRAMIENTAS
            </span>
          ))}
        </div>
        <div className="flex animate-marquee text-lg sm:text-xl md:text-2xl font-bold tracking-wide" aria-hidden="true">
          {Array.from({ length: repetitions }).map((_, index) => (
            <span key={index} className="inline-block mx-2 sm:mx-3 text-white">
              HERRAMIENTAS
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
