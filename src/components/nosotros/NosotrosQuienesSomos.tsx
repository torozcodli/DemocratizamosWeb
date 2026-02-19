import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export async function NosotrosQuienesSomos() {
  const t = await getTranslations('nosotros.quienesSomos');
  return (
    <section id="quienes-somos" className="relative w-full overflow-x-clip">
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-[300px] sm:h-[360px] md:h-[500px] lg:h-[560px] xl:h-[640px] w-full">
            <Image
              src="/images/Meeting.jpeg"
              alt="Equipo trabajando juntos"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="relative bg-[#D7DCFF] w-full p-6 sm:p-8 md:p-10 lg:p-12 xl:pl-16 xl:pr-8 xl:py-16 flex items-start min-h-[300px] sm:min-h-[360px] md:min-h-[500px] lg:min-h-[560px] xl:min-h-0">
            <div className="absolute bottom-0 right-0 w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] md:w-[400px] md:h-[400px] lg:w-[460px] lg:h-[460px] xl:w-[520px] xl:h-[520px] rounded-full bg-[#6F74C9]/10 md:bg-[#6F74C9]/15 lg:bg-[#6F74C9]/20 translate-x-1/4 translate-y-1/4 pointer-events-none"></div>

            <div className="relative z-10 w-full">
              <h2 className="text-[clamp(28px,5vw,48px)] sm:text-[clamp(32px,4.5vw,52px)] md:text-[clamp(34px,4vw,56px)] font-tech font-extrabold tracking-tight text-[#1E1A49]">
                {t('title')}
              </h2>

              <div className="mt-4 sm:mt-6 md:mt-6 space-y-5 sm:space-y-6 md:space-y-8 max-w-[75ch]">
                <p className="text-[15px] sm:text-[16px] md:text-[17px] xl:text-[18px] leading-relaxed text-[#1E1A49]/75">
                  {t('p1')}
                </p>
                <p className="text-[15px] sm:text-[16px] md:text-[17px] xl:text-[18px] leading-relaxed text-[#1E1A49]/75">
                  {t('p2')}
                </p>
                <p className="text-[15px] sm:text-[16px] md:text-[17px] xl:text-[18px] leading-relaxed text-[#1E1A49]/75">
                  {t('p3')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
