import Image from 'next/image';

const cards = [
  {
    number: 1,
    title: 'Profesionalización',
    description:
      'Talleres de IA, Ventas Online, Ciberseguridad, Marketing Digital y más para emprendedores, mujeres, MiPyMEs y público general.',
  },
  {
    number: 2,
    title: 'Habilidades Tecnológicas',
    description:
      'Talleres como CodeHeros y Programación para niños, adolescentes, mujeres adultas y público general.',
  },
  {
    number: 3,
    title: 'Acompañamiento',
    description:
      'Plataforma de incubación, consultoría, mentoría y apoyo en implementación tecnológica.',
  },
  {
    number: 4,
    title: 'Sensibilización',
    description:
      'Pláticas sobre uso de tecnología y propiedad intelectual para diversos sectores.',
  },
  {
    number: 5,
    title: 'Orientación',
    description:
      'Canalización a servicios externos y acceso a equipos de cómputo.',
  },
  {
    number: 6,
    title: 'Protección',
    description:
      'Orientación en trámites ante IMPI e INDAUTOR para protección de innovaciones.',
  },
];

export function NosotrosPropuestaValorSection() {
  return (
    <section className="relative w-full overflow-hidden py-16 md:py-20 lg:py-24">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/NosotrosSeccion2_PropuestaValor_ref.jpg"
          alt="Propuesta de Valor"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 z-[1] bg-[#1D194C]/80 backdrop-blur-[1px]"></div>

      {/* Decoración línea (fuera de márgenes, desde el borde izquierdo) */}
      <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
        {/* Línea horizontal desde el borde izquierdo - igual a Principios de acción */}
        <div className="hidden lg:block absolute left-0 top-[340px] md:top-[380px] lg:top-[420px] w-[356px] md:w-[396px] lg:w-[436px] h-[4px] bg-white">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full bg-white"></div>
        </div>
      </div>

      {/* Contenido */}
      <div className="relative z-10">
        <div className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.25fr] gap-10 lg:gap-14 items-start pl-6 md:pl-10 lg:pl-12 pr-6 md:pr-10 lg:pr-12">
            {/* Columna izquierda - Título + Texto */}
            <div className="relative">
              {/* Título */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-tech font-extrabold leading-tight tracking-tight">
                <span className="text-[#E68956]">Propuesta de</span>
                <br />
                <span className="text-[#E68956]">Valor:</span>
                <br />
                <span className="text-white">Programas</span>
                <br />
                <span className="text-white">y servicios</span>
              </h2>

              {/* Texto descriptivo */}
              <p className="mt-12 md:mt-14 lg:mt-16 text-white text-base md:text-lg leading-relaxed max-w-[90%]">
                Nuestra propuesta de valor se estructura en seis componentes principales, diseñados para atender las diferentes necesidades y oportunidades de la población en Chihuahua en materia de{' '}
                <strong className="font-bold">inclusión digital y desarrollo tecnológico</strong>.
              </p>
            </div>

            {/* Columna derecha - Grid de 6 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-7">
              {cards.map((card) => (
                <div
                  key={card.number}
                  className="bg-[#4A4784]/80 rounded-3xl p-6 shadow-[0_12px_30px_rgba(0,0,0,0.25)] min-h-[280px] md:min-h-[300px] flex flex-col"
                >
                  {/* Badge circular con número */}
                  <div className="w-10 h-10 rounded-full border border-white/60 text-white flex items-center justify-center text-sm font-bold mb-4 shrink-0">
                    {card.number}
                  </div>

                  {/* Título */}
                  <h3 className="text-[#E68956] font-tech font-bold text-lg md:text-xl mb-3">
                    {card.title}
                  </h3>

                  {/* Descripción */}
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
