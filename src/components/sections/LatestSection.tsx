import Image from 'next/image';
import { Container } from '@/components/ui/Container';

const latestItems = [
  {
    title: 'Capacitación en Ciberseguridad',
    description:
      'Taller intensivo para fortalecer las habilidades digitales seguras en sectores vulnerables. Se abordaron prácticas básicas de protección de datos y navegación responsable.',
    image: '/images/CapacitacionCiber.jpg',
  },
  {
    title: 'Feria de Tecnología Social',
    description:
      'Una jornada para compartir herramientas tecnológicas aplicadas a problemas comunitarios. Participaron jóvenes de zonas rurales con proyectos innovadores en accesibilidad digital.',
    image: '/images/Feriade.jpg',
  },
  {
    title: 'Taller de Innovación Digital',
    description:
      'Una iniciativa para impulsar habilidades tecnológicas, creatividad e inclusión digital entre jóvenes y emprendedores. Este taller forma parte del programa de profesionalización para comunidades vulnerables.',
    image: '/images/TallerdeInnovacion.jpeg',
  },
];

export function LatestSection() {
  return (
    <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
      {/* Capa base: Color lavanda/púrpura claro */}
      <div className="absolute inset-0 z-0 bg-[#B5BBEF]" />

      {/* Wrapper para decoraciones */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Círculo 1: bottom-left (grande, parcialmente cortado) - más morado */}
        <div className="absolute bottom-0 left-0 z-[1] opacity-60" style={{ filter: 'blur(1px)' }}>
          <svg
            width="1000"
            height="1000"
            viewBox="0 0 464 464"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[600px] md:w-[800px] lg:w-[1000px] -translate-x-1/3 translate-y-1/3"
            aria-hidden="true"
          >
            <g clipPath="url(#clip0_circle1_latest)">
              <path
                opacity="0.6"
                d="M231.995 463.98C360.117 463.98 463.98 360.116 463.98 231.995C463.98 103.873 360.117 0.00973511 231.995 0.00973511C103.873 0.00973511 0.00976562 103.873 0.00976562 231.995C0.00976562 360.116 103.873 463.98 231.995 463.98Z"
                fill="#8B7DFF"
              />
            </g>
            <defs>
              <clipPath id="clip0_circle1_latest">
                <rect width="464" height="464" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Círculo 2: right, más arriba (pequeño) - más morado */}
        <div className="absolute right-[5%] top-[10%] z-[1] opacity-55" style={{ filter: 'blur(1px)' }}>
          <svg
            width="500"
            height="500"
            viewBox="0 0 464 464"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[250px] md:w-[350px] lg:w-[450px] translate-x-1/4"
            aria-hidden="true"
          >
            <g clipPath="url(#clip0_circle2_latest)">
              <path
                opacity="0.6"
                d="M231.995 463.98C360.117 463.98 463.98 360.116 463.98 231.995C463.98 103.873 360.117 0.00973511 231.995 0.00973511C103.873 0.00973511 0.00976562 103.873 0.00976562 231.995C0.00976562 360.116 103.873 463.98 231.995 463.98Z"
                fill="#8B7DFF"
              />
            </g>
            <defs>
              <clipPath id="clip0_circle2_latest">
                <rect width="464" height="464" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Cuadritos naranjas 1: izquierda */}
        <div className="absolute left-[17%] top-0 z-[2] opacity-90 pointer-events-none">
          <Image
            src="/solar/icons/pixel-squares-orange.svg"
            alt=""
            width={80}
            height={80}
            className="w-16 md:w-20 lg:w-24"
            aria-hidden="true"
          />
        </div>

        {/* Cuadritos naranjas 2: centro arriba (entre cards) */}
        <div className="absolute left-[32%] top-[50%] z-[2] opacity-90 pointer-events-none">
          <Image
            src="/solar/icons/pixel-squares-orange.svg"
            alt=""
            width={80}
            height={80}
            className="w-16 md:w-20 lg:w-24"
            aria-hidden="true"
          />
        </div>

        {/* Cuadritos naranjas 3: derecha */}
        <div className="absolute right-[15%] top-[21%] z-[2] opacity-90 pointer-events-none">
          <Image
            src="/solar/icons/pixel-squares-orange.svg"
            alt=""
            width={80}
            height={80}
            className="w-16 md:w-20 lg:w-24"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Contenido */}
      <Container className="relative z-10 pl-4 sm:pl-6 lg:pl-8 max-w-none">
        {/* Título */}
        <h2 className="text-center text-6xl sm:text-7xl lg:text-8xl leading-[0.95] mb-16 md:mb-20">
          <span
            className="text-[#1E1A49] font-black tracking-tight font-tech-alt"
            style={{ fontWeight: 900, WebkitTextStroke: '1px #1E1A49', letterSpacing: '-0.02em' }}
          >
            Lo más nuevo.
          </span>
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 lg:gap-20 max-w-[88rem] mx-auto">
          {latestItems.map((item, index) => (
            <div
              key={index}
              className="rounded-[42px] overflow-hidden shadow-lg bg-white flex flex-col"
            >
              {/* Parte superior: Imagen con overlay */}
              <div className="relative h-[175px] lg:h-[195px]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 400px"
                />
                {/* Overlay degradado */}
                <div
                  className="absolute inset-0 rounded-t-[42px]"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 0%, rgba(30, 26, 73, 0.1) 30%, rgba(30, 26, 73, 0.6) 100%)',
                  }}
                />
              </div>

              {/* Parte inferior: Panel navy */}
              <div className="bg-[#1E1A49] px-10 py-8 flex-1 flex flex-col">
                {/* Título */}
                <h3 className="text-[32px] text-white text-center font-avenir font-bold" style={{ fontWeight: 700 }}>{item.title}</h3>

                {/* Línea divisora */}
                <div className="mx-auto mt-4 h-[2px] w-16 bg-white/70 rounded-full" />

                {/* Descripción */}
                <p className="mt-6 text-lg leading-relaxed text-white/80 text-left font-avenir" style={{ fontWeight: 400 }}>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

