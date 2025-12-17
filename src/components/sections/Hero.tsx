import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { WhatsAppBanner } from '@/components/ui/WhatsAppBanner';
import { homeContent } from '@/content/home';

export function Hero() {
  return (
    <section id="inicio" className="pt-8 md:pt-12 lg:pt-14 pb-8 md:pb-12 lg:pb-16 relative overflow-visible">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(circle 400px at 20% 25%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 60%),
            radial-gradient(circle 350px at 60% 40%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 65%),
            radial-gradient(circle 300px at 80% 70%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%),
            radial-gradient(circle 250px at 15% 75%, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%),
            radial-gradient(circle 200px at 45% 15%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 75%),
            linear-gradient(180deg, #E1E6FD 0%, #D6DCF9 50%, #E1E6FD 100%)
          `,
        }}
      />

      <Container className="relative z-10 overflow-visible">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14 items-center relative min-h-[500px] lg:min-h-[700px]">
          {/* Lado izquierdo */}
          <div className="space-y-6 lg:space-y-8 -ml-10 sm:-ml-14 lg:-ml-18 z-10">
            <h1 className="font-inter font-extrabold text-[#1E1A49] text-[48px] sm:text-[56px] lg:text-[72px] leading-[1.1] tracking-[-0.02em]">
              Transformamos
              <br className="hidden lg:block" />
              <span className="whitespace-nowrap">vidas a través de</span>
              <br className="hidden lg:block" />
              <span className="whitespace-nowrap">
                <span>la </span>
                <span className="tech-word text-[#6F74C9]">Tecnología.</span>
              </span>
            </h1>

            <p className="mt-4 max-w-[52ch] text-left text-[22px] font-medium leading-normal text-[#1E1A49]/85">
              Llevando habilidades digitales a quienes más
              <br className="hidden lg:block" />
              las necesitan, contribuyendo así a la inclusión
              <br className="hidden lg:block" />
              digital y disminuyendo la desigualdad social.
            </p>

            <Link href="#contacto">
              <Button variant="primary" className="-mt-1 text-xl px-7 py-2.5">
                {homeContent.hero.cta}
              </Button>
            </Link>
          </div>

          {/* Lado derecho - Imagen */}
          <div className="relative lg:absolute lg:bottom-0 lg:-right-8 xl:-right-16 lg:w-[58%] flex items-end justify-end">
            <div className="relative w-full h-[570px] sm:h-[670px] lg:h-[920px] lg:-mb-16 overflow-visible">
              <Image
                src="/images/6f32485f-34a2-4620-9941-4a312126e43d.png"
                alt="Hero illustration"
                fill
                className="object-contain object-right-bottom"
                priority
              />
            </div>
          </div>

          {/* Banner WhatsApp pegado al borde derecho */}
          <WhatsAppBanner className="absolute bottom-0 -right-45 sm:-right-50 lg:-right-55" />
        </div>
      </Container>
    </section>
  );
}
