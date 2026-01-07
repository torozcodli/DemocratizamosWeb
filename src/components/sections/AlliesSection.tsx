import { AlliesCarousel } from './AlliesCarousel';

export function AlliesSection() {
  return (
    <section className="relative w-full bg-[#DEE3FF] py-20 flow-root mt-0">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-10 xl:px-8">
        {/* Heading */}
        <h2 className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95]">
          <span className="text-[#1E1A49] font-black tracking-tight">Nuestros </span>
          <span className="text-[#6D73B3] font-black tracking-[0.02em] tech-word">aliados.</span>
        </h2>

        {/* Subtitle */}
        <p className="mt-6 text-center text-base sm:text-lg md:text-xl font-semibold text-[#1E1A49]/80 px-4 sm:px-0">
          Valoramos a cada uno de nuestros aliados. Gracias por confiar y construir juntos.
        </p>

        {/* Carrusel */}
        <div className="relative mt-12">
          <AlliesCarousel />
        </div>
      </div>
    </section>
  );
}

