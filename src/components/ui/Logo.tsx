import { cn } from '@/lib/utils/cn';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="#inicio"
      className={cn(
        'flex items-center hover:opacity-90 transition-opacity',
        className
      )}
    >
      {/* Logo desde public/images - tamaño más grande y nítido */}
      <div className="flex-shrink-0 w-72 h-36 sm:w-80 sm:h-40 lg:w-96 lg:h-48 relative">
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

