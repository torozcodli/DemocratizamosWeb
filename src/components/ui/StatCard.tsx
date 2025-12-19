import Image from 'next/image';

interface StatCardProps {
  value: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
  size?: 'small' | 'normal' | 'large';
}

export function StatCard({ value, label, imageSrc, imageAlt, size = 'normal' }: StatCardProps) {
  const imageMinHeight = size === 'large' ? 'min-h-[400px] sm:min-h-[450px]' : size === 'small' ? 'min-h-[300px] sm:min-h-[350px]' : 'min-h-[350px] sm:min-h-[400px]';
  
  return (
    <div className="relative overflow-hidden rounded-[36px] shadow-lg bg-white w-full max-w-[450px] mx-auto flex flex-col">
      {/* Top Section: Navy Block */}
      <div 
        className="px-8 pt-10 pb-8 flex-shrink-0"
        style={{
          background: 'linear-gradient(180deg, #0D0E2F 0%, #25214F 100%)',
        }}
      >
        <div className="text-6xl sm:text-7xl lg:text-8xl font-tech text-white leading-none tracking-tight">
          {value}
        </div>
        <div className="mt-6 text-xl sm:text-2xl font-inter font-light text-white/90">
          {label}
        </div>
      </div>

      {/* Bottom Section: Image with Overlay */}
      <div className={`relative flex-1 ${imageMinHeight}`}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
        />
        {/* Overlay Gradient - naranja suave y menos intenso */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(249, 115, 22, 0.15) 0%, rgba(251, 146, 60, 0.08) 15%, transparent 30%)',
          }}
        />
      </div>
    </div>
  );
}

