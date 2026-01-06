import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { TechCard } from '@/components/ui/TechCard';
import { homeContent } from '@/content/home';

export function About() {
  return (
    <section
      id="nosotros"
      className="relative py-20 md:py-28 overflow-x-clip overflow-y-visible"
      style={{
        background: `
          radial-gradient(circle 600px at 20% 30%, rgba(185,192,255,0.15) 0%, rgba(185,192,255,0) 60%),
          radial-gradient(circle 500px at 80% 70%, rgba(240,176,124,0.12) 0%, rgba(240,176,124,0) 65%),
          linear-gradient(180deg, #0E0D2B 0%, #12113A 50%, #0E0D2B 100%)
        `,
      }}
    >
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Columna izquierda - TechCard */}
          <div className="order-1 lg:order-1">
            <TechCard title={homeContent.about.card.title}>
              <p className="mb-4">{homeContent.about.card.text}</p>
              <p>{homeContent.about.card.additional}</p>
            </TechCard>
          </div>

          {/* Columna derecha - Heading + Logo + Línea */}
          <div className="order-2 lg:order-2 space-y-8 relative overflow-visible">
            {/* Heading grande */}
            <h2 className="text-center lg:text-right text-[44px] md:text-[48px] lg:text-[72px] font-bold leading-[1.1] tracking-[-0.02em]">
              <span className="text-[#E7ECFF]">Creemos en el </span>
              <span className="tech-word text-[#B9C0FF]">poder</span>
              <span className="text-[#E7ECFF]"> de la </span>
              <span className="tech-word text-[#F0B07C]">tecnología</span>
              <span className="text-[#E7ECFF]"> para todos.</span>
            </h2>

            {/* Logo Demoinn centrado debajo del texto */}
            <div className="relative flex justify-center lg:justify-end items-center -mt-12 overflow-visible">
              <div className="relative h-36 w-36 md:h-40 md:w-40 lg:h-44 lg:w-44 flex items-center justify-center z-10 about-logo-container">
                <Image
                  src="/solar/icons/Demoinnlogo.svg"
                  alt="Demoinn Logo"
                  width={176}
                  height={176}
                  className="object-contain"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
            </div>

            {/* Línea horizontal pegada a la derecha */}
            <div className="relative hidden lg:block -mt-18">
              <div className="absolute right-0 h-[2px] bg-[#9DACFD] top-1/2 -translate-y-1/2 w-[70%] max-w-[500px]" style={{ right: '-13rem' }}>
                {/* Nodo circular al inicio de la línea (izquierda) - igual al de DecorativeLine */}
                <svg
                  className="absolute -top-[10px] left-0"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Círculo exterior */}
                  <circle
                    cx="11"
                    cy="11"
                    r="10.25"
                    stroke="#9DACFD"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                  />
                  {/* Círculo interior */}
                  <circle
                    cx="11"
                    cy="11"
                    r="3.5"
                    fill="#C7D2FF"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
