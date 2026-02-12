import Image from 'next/image';

const values = [
  { 
    title: 'Inclusión', 
    icon: '/solar/icons/InclusionValor.svg', 
    description: 'Igualdad de oportunidades para todas las personas, sin excepciones.' 
  },
  { 
    title: 'Equidad', 
    icon: '/solar/icons/EquidadValor.svg', 
    description: 'Distribuimos recursos y oportunidades para que cada quien alcance su potencial.' 
  },
  {
    title: 'Solidaridad',
    icon: '/solar/icons/SolidaridadValor.svg',
    description: 'Promover la colaboración, el apoyo mutuo y la responsabilidad compartida para lograr el bien común.',
  },
  {
    title: 'Innovación',
    icon: '/solar/icons/InnovacionValor.svg',
    description: 'Brindar soluciones creativas a problemas cotidianos.',
  },
  {
    title: 'Responsabilidad',
    icon: '/solar/icons/ResponsabilidadValor.svg',
    description: 'Actuar consciente con compromiso ético procurando el impacto positivo de la organización.',
  },
];

export function ValoresSection() {
  return (
    <section className="w-full bg-[#D7DCFF] py-14 md:py-16 lg:py-20 overflow-x-clip">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-10 xl:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-10 md:gap-12">
          {values.map((v) => (
            <div key={v.title} className="flex flex-col items-center text-center max-w-[220px] mx-auto">
              <div className="w-28 h-28 rounded-full bg-[#A8B2FF] flex items-center justify-center">
                <Image 
                  src={v.icon} 
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
