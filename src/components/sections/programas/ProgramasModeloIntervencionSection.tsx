import Image from 'next/image';

export function ProgramasModeloIntervencionSection() {
  return (
    <section className="w-full overflow-x-clip min-h-[560px] md:min-h-[620px] lg:min-h-[680px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
        {/* Columna izquierda - Imagen */}
        <div className="relative min-h-[280px] md:min-h-[620px] lg:min-h-[680px]">
          <Image
            src="/images/Eventodani.jpg"
            alt="Evento de capacitación"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay degradado suave en la parte baja */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#E68956]/35 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* Columna derecha - Panel lila */}
        <div className="relative bg-[#AEB3FF] flex items-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          {/* Decoración línea (desde el borde derecho hacia la izquierda) */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            <div className="hidden lg:block absolute right-0 top-[218px] md:top-[238px] lg:top-[258px] w-[356px] md:w-[396px] lg:w-[436px] h-[4px] bg-[#6F74C9]">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#6F74C9]"></div>
            </div>
          </div>

          {/* Contenedor interno */}
          <div className="relative z-10 max-w-xl w-full pl-4 sm:pl-6 lg:pl-8">
            {/* Título */}
            <div className="mb-14 md:mb-16 lg:mb-20">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-tech font-extrabold tracking-tight leading-tight">
                <span className="text-[#1D194C]">Nuestro modelo</span>
                <br />
                <span className="text-white">de intervención.</span>
              </h2>
            </div>

            {/* Texto (3 párrafos) */}
            <div className="space-y-6 text-[#1D194C]/80 leading-relaxed text-base sm:text-lg">
              <p>
                En Democratizamos la Innovación, A.C. entendemos la inclusión digital como un proceso integral que va más allá del acceso a la tecnología: implica <strong className="font-bold text-[#1D194C]">educar, conectar, acompañar y empoderar a las personas para que puedan usarla con propósito.</strong>
              </p>
              
              <p>
                Por eso, nuestro modelo se centra en cinco ejes complementarios que fortalecen el desarrollo personal, económico y social.
              </p>
              
              <p>
                Cada eje se conecta con los demás, formando una red que impulsa la transformación social a través de la tecnología.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 
        NOTAS DE IMPLEMENTACIÓN:
        - Background panel: #AEB3FF (lila/morado claro)
        - Texto color: #1D194C/80 (80% opacidad)
        - Bold text: #1D194C (100% opacidad)
        - Nodo border: #1D194C/40, punto interno: #1D194C/50
        - Línea decorativa: #1D194C/40
        - Pixeles decorativos: #1D194C/80
        - Overlay imagen: from-[#E68956]/35 (35% opacidad naranja)
        - Layout: grid 50/50 en desktop, stack en mobile
        - Min heights: 560px md:620px lg:680px
      */}
    </section>
  );
}
