import { getTranslations } from 'next-intl/server';

export async function DiscountMarquee() {
  const t = await getTranslations('herramientas');
  const text = t('marquee');
  const repetitions = 15;

  return (
    <div className="w-full bg-[#E68956] overflow-hidden isolate py-3 sm:py-4 my-0 border-y border-[#E68956]/20">
      <div className="flex whitespace-nowrap">
        <div className="flex animate-marquee text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
          {Array.from({ length: repetitions }).map((_, index) => (
            <span key={index} className="inline-block mx-2 sm:mx-3 text-white">
              {text}
            </span>
          ))}
        </div>
        <div className="flex animate-marquee text-lg sm:text-xl md:text-2xl font-bold tracking-wide" aria-hidden="true">
          {Array.from({ length: repetitions }).map((_, index) => (
            <span key={index} className="inline-block mx-2 sm:mx-3 text-white">
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
