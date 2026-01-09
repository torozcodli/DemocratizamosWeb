import Image from 'next/image';

const metrics = [
  {
    value: '420',
    label: 'Soluciones\nde consultoría',
    valueColor: 'text-[#FFB07A]',
  },
  {
    value: '+5000',
    label: 'Casos\ncompletados',
    valueColor: 'text-white',
  },
  {
    value: '4999',
    label: 'Clientes\nsatisfechos',
    valueColor: 'text-white',
  },
  {
    value: '160',
    label: 'Consultores\nexpertos',
    valueColor: 'text-white',
  },
];

export function ResultsSection() {
  return (
    <section className="relative w-full min-h-[360px] md:min-h-[420px] lg:min-h-[520px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/NosotrosFoto.jpg.jpg"
          alt="Resultados y métricas"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>

      {/* Overlay oscuro - múltiples capas para efecto morado */}
      <div className="absolute inset-0 z-[1] bg-[#1D194C]/70"></div>
      {/* Vignette horizontal */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-r from-[#090828]/60 via-transparent to-[#090828]/60"></div>
      {/* Vignette vertical */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-[#090828]/50 via-transparent to-[#090828]/50"></div>

      {/* Contenido - Cards de métricas */}
      <div className="relative z-10 flex items-center justify-center min-h-[360px] md:min-h-[420px] lg:min-h-[520px] py-12 md:py-16">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 lg:gap-12 place-items-center">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="w-[200px] sm:w-[220px] md:w-[240px] h-[160px] md:h-[180px] bg-[#3B3A64]/85 rounded-2xl shadow-lg shadow-[#090828]/30 flex flex-col items-center justify-center px-6"
              >
                {/* Número grande */}
                <div className={`text-4xl md:text-5xl lg:text-6xl font-tech font-extrabold tracking-tight ${metric.valueColor} mb-3`}>
                  {metric.value}
                </div>
                
                {/* Texto pequeño con saltos de línea */}
                <p className="text-sm md:text-base text-white/80 text-center leading-tight max-w-[14ch] whitespace-pre-line">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
