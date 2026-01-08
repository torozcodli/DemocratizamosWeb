import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/inicio"
      className={cn(
        'flex items-center hover:opacity-90 transition-opacity',
        className
      )}
    >
      {/* Logo desde public/images - tamaño más grande y nítido */}
      <div className="flex-shrink-0 w-56 h-28 sm:w-64 sm:h-32 md:w-72 md:h-36 lg:w-96 lg:h-48 relative max-w-[90vw] sm:max-w-none">
        <Image
          src="/images/ImagotipoColor.png"
          alt="Democratizamos la Innovación"
          width={384}
          height={192}
          quality={100}
          className="w-full h-full object-contain object-left"
          priority
          unoptimized={false}
        />
      </div>
    </Link>
  );
}

