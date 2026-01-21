'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'border-b border-navy-200/20 bg-lavender/80 backdrop-blur-md'
          : 'border-b border-transparent bg-[#E1E6FD] backdrop-blur-none'
      )}
    >
      <div className="w-full">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-6 xl:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between">
            <div>
            <Logo />
          </div>
            <div className="hidden xl:flex xl:items-center xl:gap-4">
            {siteConfig.navigation.map((item, index) => {
                const isActive = item.href === pathname;
                const isDisabled = item.href === '#';
              return (
                <Link
                    key={`${item.label}-${index}`}
                  href={item.href}
                  prefetch={false}
                    onClick={(e) => {
                      if (isDisabled) {
                        e.preventDefault();
                      }
                    }}
                  className={cn(
                    'text-lg font-medium transition-all relative px-4 py-2 rounded-full',
                    isActive
                      ? 'text-navy-900 bg-lavender hover:ring-2 hover:ring-[#6F74C9] hover:ring-offset-2'
                        : isDisabled
                        ? 'text-navy-900/50 cursor-not-allowed'
                      : 'text-navy-900 hover:text-navy-900 hover:bg-lavender/50 hover:ring-2 hover:ring-[#6F74C9] hover:ring-offset-2'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
              <a href={siteConfig.cta.href} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="ml-2 mr-4">
                {siteConfig.cta.label}
              </Button>
              </a>
          </div>
          <button
              className="xl:hidden h-12 w-12 rounded-full bg-indigo-200/60 hover:bg-indigo-200 flex items-center justify-center transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
              {isOpen ? <X size={24} className="h-6 w-6 text-indigo-950/80" /> : <Menu size={24} className="h-6 w-6 text-indigo-950/80" />}
          </button>
          </div>
        </div>
        {isOpen && (
          <>
            {/* Overlay full-screen */}
            <div className="xl:hidden fixed inset-0 bg-[#1E1A49]/95 backdrop-blur-md z-50">
              {/* Botón cerrar arriba derecha */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setIsOpen(false)}
                  className="h-12 w-12 rounded-full bg-indigo-200/60 hover:bg-indigo-200 flex items-center justify-center transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} className="h-6 w-6 text-indigo-950/80" />
                </button>
              </div>
              
              {/* Menú centrado verticalmente */}
              <div className="flex flex-col items-center justify-center h-full px-4">
                <nav className="space-y-6 text-center">
                  {siteConfig.navigation.map((item, index) => {
                    const isActive = item.href === pathname;
                    const isDisabled = item.href === '#';
                    return (
                      <Link
                        key={`${item.label}-${index}`}
                        href={item.href}
                        prefetch={false}
                        onClick={(e) => {
                          if (isDisabled) {
                            e.preventDefault();
                          } else {
                            setIsOpen(false);
                          }
                        }}
                        className={cn(
                          'block text-2xl md:text-3xl font-medium transition-colors',
                          isActive
                            ? 'text-white'
                            : isDisabled
                            ? 'text-[#E1E6FD]/50 cursor-not-allowed'
                            : 'text-[#E1E6FD] hover:text-white'
                        )}
                >
                  {item.label}
                </Link>
              );
            })}
                  <a 
                    href={siteConfig.cta.href} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block mt-8"
                    onClick={() => setIsOpen(false)}
                  >
                    <Button variant="primary" className="text-lg md:text-xl px-8 py-3 rounded-full">
                {siteConfig.cta.label}
              </Button>
                  </a>
                </nav>
              </div>
          </div>
          </>
        )}
      </div>
    </nav>
  );
}

