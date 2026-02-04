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
    <>
      <nav
        className={cn(
          'top-0 z-50 w-full transition-all duration-300',
          // Menú hamburguesa hasta 2xl (1536px); desde 2xl: sticky y enlaces visibles
          'fixed left-0 right-0 2xl:static',
          '2xl:sticky',
          isScrolled
            ? 'border-b border-navy-200/20 bg-lavender/80 backdrop-blur-md'
            : 'border-b border-transparent bg-[#E1E6FD] backdrop-blur-none'
        )}
      >
        {children}
      </nav>
      {/* Espaciador cuando el nav es fixed (móvil/tablet) para que el contenido no quede bajo la barra */}
      <div className="2xl:hidden h-16 md:h-20 flex-shrink-0" aria-hidden />
    </>
  );
}
