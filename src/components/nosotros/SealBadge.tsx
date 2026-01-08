import Image from 'next/image';

interface SealBadgeProps {
  text: string; // "Misión" o "Visión"
}

export function SealBadge({ text }: SealBadgeProps) {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] sm:w-[121px] sm:h-[121px] md:w-[140px] md:h-[140px] lg:w-[167px] lg:h-[167px] z-30">
      <Image
        src="/solar/icons/Demologo.svg"
        alt={`${text} - Demoinn Logo`}
        width={176}
        height={176}
        className="w-full h-full"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
