import { cn } from '@/lib/utils/cn';
import Link from 'next/link';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="#inicio"
      className={cn(
        'text-xl font-bold text-primary-700 hover:text-primary-800 transition-colors',
        className
      )}
    >
      Democratizamos la Innovación
    </Link>
  );
}

