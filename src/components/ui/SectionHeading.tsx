import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';

interface SectionHeadingProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export function SectionHeading({
  children,
  className,
  as: Component = 'h2',
}: SectionHeadingProps) {
  return (
    <Component
      className={cn(
        'text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900',
        className
      )}
    >
      {children}
    </Component>
  );
}

