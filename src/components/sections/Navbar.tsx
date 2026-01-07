'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
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
      <div className="w-full">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-10 xl:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between">
            <div>
              <Logo />
            </div>
            <div className="hidden xl:flex xl:items-center xl:gap-4">
              {siteConfig.navigation.map((item, index) => {
                const isActive = item.href === '#inicio';
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'text-lg font-medium transition-all relative px-4 py-2 rounded-full',
                      isActive
                        ? 'text-navy-900 bg-lavender hover:ring-2 hover:ring-[#6F74C9] hover:ring-offset-2'
                        : 'text-navy-900 hover:text-navy-900 hover:bg-lavender/50 hover:ring-2 hover:ring-[#6F74C9] hover:ring-offset-2'
                    )}
                  >
                    {item.label}
                  </a>
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
          <div className="xl:hidden py-4 space-y-4 border-t border-navy-200/30 mt-2">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-10 xl:px-8">
              {siteConfig.navigation.map((item) => {
                const isActive = item.href === '#inicio';
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'block text-lg font-medium transition-colors px-3 py-2 rounded-full',
                      isActive
                        ? 'text-navy-900 bg-lavender'
                        : 'text-navy-900 hover:text-navy-900'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                );
              })}
              <a href={siteConfig.cta.href} target="_blank" rel="noopener noreferrer" className="block" onClick={() => setIsOpen(false)}>
                <Button variant="primary" className="w-full rounded-full">
                  {siteConfig.cta.label}
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

