import { cn } from '@/lib/utils/cn';
import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn('mx-auto max-w-7xl w-full px-4 sm:px-6 md:px-10 xl:px-8', className)}>
      {children}
    </div>
  );
}

