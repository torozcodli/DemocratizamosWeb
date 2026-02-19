import { getTranslations } from 'next-intl/server';

export async function Ribbon() {
  const t = await getTranslations('home.ribbon');
  const repetitions = 15;

  const renderColoredText = () => (
    <>
      <span className="text-[#E1E6FD]">{t('prefix1')}</span>
      <span className="text-[#BDC4FA] tech-word">{t('power')}</span>
      <span className="text-[#E1E6FD]">{t('prefix2')}</span>
      <span className="text-[#EFBE9F] tech-word">{t('tech')}</span>
      <span className="text-[#E1E6FD]">{t('suffix')}</span>
    </>
  );

  return (
    <section className="relative w-full bg-[#1E1A49] overflow-hidden isolate py-3 sm:py-4 my-0 border-y border-[#E1E6FD]/15">
      <div className="flex whitespace-nowrap">
        <div className="flex animate-marquee text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
          {Array.from({ length: repetitions }).map((_, index) => (
            <span key={index} className="inline-block mx-2 sm:mx-3">
              {renderColoredText()}
            </span>
          ))}
        </div>
        <div className="flex animate-marquee text-lg sm:text-xl md:text-2xl font-bold tracking-wide" aria-hidden="true">
          {Array.from({ length: repetitions }).map((_, index) => (
            <span key={index} className="inline-block mx-2 sm:mx-3">
              {renderColoredText()}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

