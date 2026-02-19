import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/ui/Container';
import { TechCard } from '@/components/ui/TechCard';
import { InicioSec2Block } from '@/components/sections/InicioSec2Block.client';

type AboutProps = { sectionId?: string };

function AboutRightColumn({
  sectionId,
  headingPrefix1,
  headingPower,
  headingPrefix2,
  headingTech,
  headingSuffix,
}: {
  sectionId: string;
  headingPrefix1: string;
  headingPower: string;
  headingPrefix2: string;
  headingTech: string;
  headingSuffix: string;
}) {
  if (sectionId === 'inicio-sec2') {
    return (
      <InicioSec2Block
        headingPrefix1={headingPrefix1}
        headingPower={headingPower}
        headingPrefix2={headingPrefix2}
        headingTech={headingTech}
        headingSuffix={headingSuffix}
      />
    );
  }
  return (
    <div className="order-2 md:order-2 space-y-8 relative overflow-visible">
      <h2 className="text-center md:text-center xl:text-right text-[44px] md:text-[48px] lg:text-[56px] xl:text-[72px] font-bold leading-[1.1] tracking-[-0.02em]">
        <span className="text-[#E7ECFF]">{headingPrefix1}</span>
        <span className="tech-word text-[#B9C0FF]">{headingPower}</span>
        <span className="text-[#E7ECFF]">{headingPrefix2}</span>
        <span className="tech-word text-[#F0B07C]">{headingTech}</span>
        <span className="text-[#E7ECFF]">{headingSuffix}</span>
      </h2>
      <div className="relative flex justify-center md:justify-center xl:justify-end items-center -mt-12 overflow-visible">
        <div className="relative h-36 w-36 md:h-40 md:w-40 lg:h-44 lg:w-44 z-10 about-logo-container">
          <div className="absolute inset-0 flex items-center justify-center will-change-transform">
            <Image
              src="/solar/icons/Demoinnlogo.svg"
              alt="Demoinn Logo"
              width={176}
              height={176}
              className="object-contain"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
      <div className="relative hidden xl:block -mt-18">
        <div
          className="absolute right-0 h-[2px] top-1/2 -translate-y-1/2 w-[70%] max-w-[500px]"
          style={{ right: '-13rem' }}
        >
          <svg
            className="absolute -top-[10px] left-0 flex-shrink-0 z-10"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <circle cx="11" cy="11" r="10.25" stroke="#9DACFD" strokeWidth="1.5" strokeMiterlimit="10" />
            <circle cx="11" cy="11" r="3.5" fill="#C7D2FF" />
          </svg>
          <div
            className="absolute left-[22px] right-0 top-0 h-[2px] bg-[#9DACFD] will-change-transform"
            style={{ transformOrigin: '100% 50%' }}
          />
        </div>
      </div>
    </div>
  );
}

export async function About({ sectionId = 'nosotros' }: AboutProps) {
  const t = await getTranslations('home.about');
  return (
    <section
      id={sectionId}
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
        <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16 items-center">
          <div className="order-1 md:order-1">
            <TechCard title={t('cardTitle')}>
              <p className="mb-4">{t('cardText')}</p>
              <p>{t('cardAdditional')}</p>
            </TechCard>
          </div>
          <AboutRightColumn
            sectionId={sectionId}
            headingPrefix1={t('headingPrefix1')}
            headingPower={t('headingPower')}
            headingPrefix2={t('headingPrefix2')}
            headingTech={t('headingTech')}
            headingSuffix={t('headingSuffix')}
          />
        </div>
      </Container>
    </section>
  );
}
