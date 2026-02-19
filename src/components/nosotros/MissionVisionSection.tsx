import { getTranslations } from 'next-intl/server';
import { FlipCard } from './FlipCard';

export async function MissionVisionSection() {
  const t = await getTranslations('nosotros.missionVision');
  return (
    <section className="nosotros-mision-vision-section relative w-full bg-[#1D194C] overflow-x-clip py-20 md:py-24 lg:py-28">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-10 xl:px-8">
        <div className="nosotros-flip-grid grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-14 lg:gap-16">
          <FlipCard
            sealText={t('missionSeal')}
            frontTitle={t('missionTitle')}
            frontText={t('missionFront')}
            backText={t('missionBack')}
          />
          <FlipCard
            sealText={t('visionSeal')}
            sealSrc="/solar/vision.svg"
            frontTitle={t('visionTitle')}
            frontText={t('visionFront')}
            backText={t('visionBack')}
          />
        </div>
      </div>
    </section>
  );
}
