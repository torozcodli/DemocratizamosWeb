import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export async function NosotrosPropuestaValorSection() {
  const t = await getTranslations('nosotros.propuestaValor');
  const cards = t.raw('cards') as Array<{ title: string; description: string }>;
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-20 lg:py-24">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/NosotrosSeccion2_PropuestaValor_ref.jpg"
          alt={t('alt')}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>

      <div className="absolute inset-0 z-[1] bg-[#1D194C]/80 backdrop-blur-[1px]"></div>

      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        <div className="hidden lg:block absolute left-0 top-[340px] md:top-[380px] lg:top-[420px] w-[356px] md:w-[396px] lg:w-[436px] h-[4px] bg-[#9DACFD]">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full bg-[#9DACFD]"></div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.25fr] gap-10 lg:gap-14 items-start pl-6 md:pl-10 lg:pl-12 pr-6 md:pr-10 lg:pr-12">
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-tech font-extrabold leading-tight tracking-tight">
                <span className="text-[#E68956]">{t('title1')}</span>
                <br />
                <span className="text-[#E68956]">{t('title2')}</span>
                <br />
                <span className="text-white">{t('title3')}</span>
                <br />
                <span className="text-white">{t('title4')}</span>
              </h2>
              <p className="mt-12 md:mt-14 lg:mt-16 text-white text-base md:text-lg leading-relaxed max-w-[90%]">
                {t('intro')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-7">
              {cards.map((card, i) => (
                <div
                  key={card.title + i}
                  className="bg-[#4A4784]/80 rounded-3xl p-6 shadow-[0_12px_30px_rgba(0,0,0,0.25)] min-h-[280px] md:min-h-[300px] flex flex-col"
                >
                  <div className="w-10 h-10 rounded-full border border-white/60 text-white flex items-center justify-center text-sm font-bold mb-4 shrink-0">
                    {i + 1}
                  </div>
                  <h3 className="text-[#E68956] font-tech font-bold text-lg md:text-xl mb-3">
                    {card.title}
                  </h3>
                  <p className="text-white/85 text-sm leading-relaxed flex-1">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
