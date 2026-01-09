import Image from 'next/image';
import { Linkedin } from 'lucide-react';
import Link from 'next/link';

interface TeamCardProps {
  frameSrc: string;
  role: string;
  name: string;
  linkedinUrl?: string;
  className?: string;
}

export function TeamCard({
  frameSrc,
  role,
  name,
  linkedinUrl = '#',
  className = '',
}: TeamCardProps) {
  return (
    <div className={`relative w-full max-w-[320px] md:max-w-[340px] mx-auto ${className}`}>
      {/* SVG Frame */}
      <div className="relative w-full">
        <Image
          src={frameSrc}
          alt={`${name} - ${role}`}
          width={340}
          height={400}
          className="w-full h-auto"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      {/* LinkedIn Button */}
      <Link
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`LinkedIn de ${name}`}
        className="absolute -bottom-3 -right-3 h-11 w-11 bg-[#FF8948] text-[#1D194C] rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-200 z-10"
      >
        <Linkedin className="w-5 h-5" />
      </Link>
    </div>
  );
}
