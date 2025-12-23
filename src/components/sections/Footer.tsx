'use client';

import { Container } from '@/components/ui/Container';
import { siteConfig } from '@/config/site';
import { Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

// Simple TikTok icon component
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19.59 9.23a5.5 5.5 0 0 1-1.45-3.89v-4.5h-3.26a7.51 7.51 0 0 1 .14 1.59 5.15 5.15 0 0 1-2.86 4.83v-3.22a8.41 8.41 0 0 0-1-.05 8.27 8.27 0 0 0-8.27 8.27c0 .34 0 .67.05 1a8.27 8.27 0 0 1-4.64-1.42l.01 3.22a11.2 11.2 0 0 0 6.29 1.84 11.19 11.19 0 0 0 10.76-8.13v-7.27a13.76 13.76 0 0 0 4.41-.61v-3.4z" />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder - no real submission logic
    console.log('Newsletter submission:', email);
    setEmail('');
  };

  return (
    <footer className="relative bg-gradient-to-r from-[#090828] to-[#1D194C] text-[#E1E6FD] pt-28 pb-24">
      {/* Floating circular logo badge */}
      <div className="pointer-events-none absolute left-1/2 -top-16 -translate-x-1/2 w-40 h-40 md:w-44 md:h-44 z-10">
        <img
          src="/solar/icons/Demoinnlogo.svg"
          alt="Demoinn Logo"
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>

      <Container className="max-w-[95%] lg:max-w-[90%]">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr_.75fr_1.6fr] lg:gap-x-16 lg:gap-y-0 items-start px-4 lg:px-6">
          {/* Column 1: Branding */}
          <div className="space-y-4">
            <Image
              src="/solar/icons/DemoinnBlanco.svg"
              alt="Demoinn Logo"
              width={240}
              height={240}
              className="object-contain"
            />
          </div>

          {/* Column 2: Social Media & Contact */}
          <div className="space-y-8">
            <div>
              <h4 className="font-semibold text-[#E1E6FD] mb-6">Redes sociales</h4>
              <div className="flex gap-4">
                <a
                  href={siteConfig.social.linkedin}
                  className="w-8 h-8 rounded-full border border-[#E1E6FD] flex items-center justify-center text-[#E1E6FD] hover:bg-white/10 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={14} />
                </a>
                <a
                  href={siteConfig.social.instagram}
                  className="w-8 h-8 rounded-full border border-[#E1E6FD] flex items-center justify-center text-[#E1E6FD] hover:bg-white/10 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={14} />
                </a>
                <a
                  href={siteConfig.social.facebook}
                  className="w-8 h-8 rounded-full border border-[#E1E6FD] flex items-center justify-center text-[#E1E6FD] hover:bg-white/10 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={14} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full border border-[#E1E6FD] flex items-center justify-center text-[#E1E6FD] hover:bg-white/10 transition-colors"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="space-y-4">
              <a
                href={`tel:${siteConfig.phone}`}
                className="flex items-center gap-2 text-sm text-[#E1E6FD] hover:text-white transition-colors"
              >
                <Phone size={16} className="flex-shrink-0" />
                <span>{siteConfig.phone}</span>
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 text-sm text-[#E1E6FD] hover:text-white transition-colors"
              >
                <Mail size={16} className="flex-shrink-0" />
                <span>{siteConfig.email}</span>
              </a>
            </div>
          </div>

          {/* Column 3: Explore */}
          <div>
            <h4 className="font-semibold text-[#E1E6FD] mb-6">Explore</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#nosotros"
                  className="text-sm text-[#E1E6FD] hover:underline transition-colors"
                >
                  Nosotros
                </a>
              </li>
              <li>
                <a
                  href="#contacto"
                  className="text-sm text-[#E1E6FD] hover:underline transition-colors"
                >
                  Contáctanos
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="w-full lg:justify-self-end lg:max-w-[520px]">
            <h4 className="font-semibold text-[#EFBE9F] mb-6 text-xl">
              ¡Déjanos tu correo y te escribimos en breve!
            </h4>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex items-center h-14 sm:h-16 rounded-full border-2 border-[#AAB3FF] bg-[#6D73B3]/35 overflow-hidden w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreoaquí@correo.com"
                  className="flex-1 bg-transparent px-6 outline-none placeholder:text-[#E1E6FD]/35 text-[#E1E6FD]/80 text-sm sm:text-base h-full min-w-0"
                  aria-label="Email para newsletter"
                />
                <button
                  type="submit"
                  className="h-full px-6 sm:px-8 flex-shrink-0 rounded-full bg-[#E79A5A] text-white font-bold text-sm sm:text-base tracking-wide hover:bg-[#E79A5A]/90 transition-colors whitespace-nowrap"
                >
                  ENVIAR
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>

      {/* Separator line with circular node - Full width */}
      <div className="mt-10 w-full h-16 sm:h-20 md:h-24">
        <Image
          src="/solar/icons/footerLine.svg"
          alt="Footer separator line"
          width={1867}
          height={105}
          className="w-full h-full object-contain object-left"
        />
      </div>

      <Container className="max-w-[95%] lg:max-w-[90%]">
        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-[#E1E6FD]/70 px-8 lg:px-12">
          <p>© {currentYear}. Todos los derechos reservados</p>
        </div>
      </Container>
    </footer>
  );
}
