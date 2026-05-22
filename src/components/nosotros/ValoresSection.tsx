import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

const valueIcons: Record<string, string> = {
  'Equidad': '/solar/icons/EquidadValor.svg',
  'Innovación': '/solar/icons/InnovacionValor.svg',
  'Colaboración': '/solar/icons/SolidaridadValor.svg',
  'Compromiso': '/solar/icons/ResponsabilidadValor.svg',
  'Equity': '/solar/icons/EquidadValor.svg',
  'Innovation': '/solar/icons/InnovacionValor.svg',
  'Collaboration': '/solar/icons/SolidaridadValor.svg',
  'Commitment': '/solar/icons/ResponsabilidadValor.svg',
};

export async function ValoresSection() {
  const t = await getTranslations('nosotros.valores');
  const values = t.raw('values') as Array<{ title: string; description: string }>;
  return (
    <section className="w-full bg-[#D7DCFF] py-14 md:py-16 lg:py-20 overflow-x-clip">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-10 xl:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {values.map((v) => (
            <div key={v.title} className="flex flex-col items-center text-center max-w-[220px] mx-auto">
              <div className="w-28 h-28 rounded-full bg-[#A8B2FF] flex items-center justify-center">
                <Image 
                  src={valueIcons[v.title] ?? '/solar/icons/EquidadValor.svg'}
                  alt={v.title} 
                  width={64} 
                  height={64} 
                  className="h-14 w-14"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>

              <h3 className="mt-5 text-[26px] md:text-[28px] font-tech font-extrabold tracking-tight text-[#1E1A49]">
                {v.title}
              </h3>

              <p className="mt-2 max-w-[22ch] text-[15px] leading-relaxed text-[#1E1A49]/80">
                {v.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
