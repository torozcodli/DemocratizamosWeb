const principles = [
  {
    number: 1,
    title: 'Agilidad.',
    description:
      'Evitamos la burocracia innecesaria. Actuamos rápido, decididos y enfocados en soluciones que generen valor social.',
    bgColor: '#4B4A78',
  },
  {
    number: 2,
    title: 'Resiliencia.',
    description:
      'Ante los retos, encontramos alternativas creativas. Nos adaptamos, aprendemos, y seguimos adelante sin perder el rumbo.',
    bgColor: '#98A7FF',
  },
  {
    number: 3,
    title: 'Convicción.',
    description:
      'Cada acción tiene propósito. Creemos profundamente en el impacto que la innovación puede tener en la vida de las personas.',
    bgColor: '#1D194C',
  },
];

export function PrincipiosAccionSection() {
  return (
    <section className="relative w-full bg-[#D7DCFF] pt-16 md:pt-20 lg:pt-24 pb-8 md:pb-10 lg:pb-12 overflow-x-clip">
      {/* Decoración full-bleed (línea + círculo grande) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {/* Línea horizontal desde el borde izquierdo - mucho más corta */}
        <div className="absolute left-0 top-[240px] md:top-[280px] lg:top-[320px] w-[356px] md:w-[396px] lg:w-[436px] h-[4px] bg-[#1E1A49]">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full bg-[#1E1A49]"></div>
        </div>

        {/* Gran círculo lavanda en esquina inferior izquierda - cortado en el borde de la sección */}
        <div className="absolute left-[-179px] bottom-[-180px] w-[880px] h-[880px] rounded-full bg-[#C8D0FF]/60 hidden lg:block"></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Lado izquierdo - Título */}
          <div className="pl-6 md:pl-10 lg:pl-12 pr-6">
            <h2 className="font-tech font-extrabold tracking-tight leading-[0.95] text-[#1E1A49] text-[48px] sm:text-[64px] md:text-[72px] lg:text-[84px]">
              Principios
              <br />
              <span>de </span>
              <span className="text-[#FF8948]">acción.</span>
            </h2>
          </div>

          {/* Lado derecho - Cards apiladas (alineadas a la derecha) con efecto stack */}
          <div className="pr-6 md:pr-10 lg:pr-12 pl-6 flex justify-end">
            <div className="relative w-full max-w-[720px]">
              {/* Contenedor con altura para permitir scroll y stacking */}
              <div className="relative h-[750px] md:h-[850px] lg:h-[950px]">
                {principles.map((principle, index) => {
                  // Top sticky: escalonado
                  const topSticky = index === 0 ? 'top-24' : index === 1 ? 'top-32' : 'top-40';
                  // Z-index: primera card arriba, última abajo
                  const zIndexClass = index === 0 ? 'z-30' : index === 1 ? 'z-20' : 'z-10';
                  // TranslateY: offset para efecto de stack
                  const translateY = index === 0 ? '' : index === 1 ? 'md:translate-y-8' : 'md:translate-y-16';
                  // Scale: ligera reducción para profundidad
                  const scale = index === 0 ? '' : index === 1 ? 'md:scale-[0.98]' : 'md:scale-[0.96]';

                  return (
                    <div
                      key={principle.number}
                      className={`sticky ${topSticky} ${zIndexClass} ${translateY} ${scale} transition-transform duration-300 ease-out will-change-transform mb-10 md:mb-12`}
                    >
                      <div
                        className="rounded-[22px] px-6 py-6 md:px-8 md:py-7 text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)] min-h-[200px] md:min-h-[220px] flex flex-col"
                        style={{ backgroundColor: principle.bgColor }}
                      >
                        <div className="flex items-start gap-6 flex-1">
                          {/* Círculo numerado */}
                          <div className="shrink-0 w-11 h-11 md:w-12 md:h-12 rounded-full border border-white/70 flex items-center justify-center text-white text-lg md:text-xl font-bold">
                            {principle.number}
                          </div>

                          {/* Contenido */}
                          <div className="flex-1 flex flex-col">
                            <h3 className="font-tech font-extrabold text-2xl md:text-3xl leading-tight">
                              {principle.title}
                            </h3>
                            <p className="mt-2 text-white/85 text-[15px] md:text-[16px] leading-relaxed flex-1">
                              {principle.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
