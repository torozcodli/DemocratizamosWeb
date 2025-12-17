'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils/cn';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Logo />
          <div className="hidden md:flex md:items-center md:gap-6">
            {siteConfig.navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <Link href={siteConfig.cta.href}>
              <Button variant="primary">{siteConfig.cta.label}</Button>
            </Link>
          </div>
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            {siteConfig.navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-sm font-medium text-slate-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <Link href={siteConfig.cta.href} className="block">
              <Button variant="primary" className="w-full">
                {siteConfig.cta.label}
              </Button>
            </Link>
          </div>
        )}
      </Container>
    </nav>
  );
}

