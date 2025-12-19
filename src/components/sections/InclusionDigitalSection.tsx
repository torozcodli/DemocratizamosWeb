import { Container } from '@/components/ui/Container';
import { BgPixelBlocks } from '@/components/ui/BgPixelBlocks';
import { SolarSystem } from '@/components/ui/SolarSystem';
import { StatCard } from '@/components/ui/StatCard';

export function InclusionDigitalSection() {
  return (
    <section
      id="inclusion-digital"
      className="relative py-20 md:py-28 lg:py-32 overflow-hidden min-h-[900px]"
    >
      {/* Capa base: Color sólido */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: '#C6CBF5',
        }}
      />

      {/* Wrapper para decoraciones */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Círculo 1: bottom-right (grande, parcialmente cortado) */}
        <div className="absolute bottom-0 right-0 z-[1] opacity-35" style={{ filter: 'blur(0.5px)' }}>
          <svg
            width="1000"
            height="1000"
            viewBox="0 0 464 464"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[600px] md:w-[800px] lg:w-[1000px] translate-x-1/4 translate-y-1/4"
            aria-hidden="true"
          >
            <g clipPath="url(#clip0_circle1)">
              <path
                opacity="0.4"
                d="M231.995 463.98C360.117 463.98 463.98 360.116 463.98 231.995C463.98 103.873 360.117 0.00973511 231.995 0.00973511C103.873 0.00973511 0.00976562 103.873 0.00976562 231.995C0.00976562 360.116 103.873 463.98 231.995 463.98Z"
                fill="#7A8AFF"
              />
            </g>
            <defs>
              <clipPath id="clip0_circle1">
                <rect width="464" height="464" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Círculo 2: left, más abajo (pequeño) */}
        <div className="absolute left-[18%] top-[52%] z-[1] opacity-30" style={{ filter: 'blur(0.5px)' }}>
          <svg
            width="500"
            height="500"
            viewBox="0 0 464 464"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[260px] md:w-[320px] lg:w-[380px] -translate-x-1/3"
            aria-hidden="true"
          >
            <g clipPath="url(#clip0_circle2)">
              <path
                opacity="0.4"
                d="M231.995 463.98C360.117 463.98 463.98 360.116 463.98 231.995C463.98 103.873 360.117 0.00973511 231.995 0.00973511C103.873 0.00973511 0.00976562 103.873 0.00976562 231.995C0.00976562 360.116 103.873 463.98 231.995 463.98Z"
                fill="#7A8AFF"
              />
            </g>
            <defs>
              <clipPath id="clip0_circle2">
                <rect width="464" height="464" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>

        {/* Rectangulitos 1: top-right - más arriba y más a la izquierda */}
        <BgPixelBlocks className="absolute right-80 top-[50%] z-[2] w-[176px] h-[85px] opacity-70 drop-shadow-sm" />

        {/* Rectangulitos 2: left, más arriba - un poco más a la derecha y un poco más abajo */}
        <BgPixelBlocks className="absolute left-56 top-40 z-[2] w-[176px] h-[85px] opacity-60 drop-shadow-sm" />

        {/* Rectangulitos 3: mucho más abajo */}
        <BgPixelBlocks className="absolute left-10 top-[78%] z-[2] w-[176px] h-[85px] opacity-70 drop-shadow-sm" />
      </div>

      {/* Capa textura: bg-texture.png repetida con opacidad (debajo de decoraciones pero sobre gradiente) */}
      <div
        className="absolute inset-0 z-[3] opacity-[0.25]"
        style={{
          backgroundImage: 'url(/inclusion-digital/bg-texture.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
        }}
      />

      {/* Contenido */}
      <Container className="relative z-10">
        {/* Sistema solar */}
        <div className="mb-20 md:mb-32">
          <SolarSystem />
        </div>

        {/* Cards de estadísticas */}
        <div className="min-h-[520px] flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24 lg:gap-32 max-w-5xl w-full">
            <StatCard
              value="+2500"
              label="Personas capacitadas"
              imageSrc="/images/capacitacion.jpg"
              imageAlt="Personas en capacitación"
            />
            <StatCard
              value="+500"
              label="Proyectos realizados"
              imageSrc="/images/proyectos.jpg"
              imageAlt="Proyectos de inclusión digital"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}


