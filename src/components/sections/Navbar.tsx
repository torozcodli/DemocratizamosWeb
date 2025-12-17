'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
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
        <div className="flex h-16 md:h-20 items-center justify-between max-w-7xl mx-auto pl-0 pr-4 sm:pr-6 lg:pr-8">
          <div className="ml-0">
            <Logo />
          </div>
          <div className="hidden md:flex md:items-center md:gap-4">
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
            <Link href={siteConfig.cta.href}>
              <Button variant="primary" className="ml-2 mr-4">
                {siteConfig.cta.label}
              </Button>
            </Link>
          </div>
          <button
            className="md:hidden text-navy-900 hover:text-navy-700 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-navy-200/30 mt-2">
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
            <Link href={siteConfig.cta.href} className="block" onClick={() => setIsOpen(false)}>
              <Button variant="primary" className="w-full rounded-full">
                {siteConfig.cta.label}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

