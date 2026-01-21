'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

interface NavbarScrollClientProps {
  children: React.ReactNode;
}

export function NavbarScrollClient({ children }: NavbarScrollClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'border-b border-navy-200/20 bg-lavender/80 backdrop-blur-md'
          : 'border-b border-transparent bg-[#E1E6FD] backdrop-blur-none'
      )}
    >
      {children}
    </nav>
  );
}
