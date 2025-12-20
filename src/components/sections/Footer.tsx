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
    <footer className="relative bg-gradient-to-r from-[#090828] to-[#1D194C] text-[#E1E6FD] pt-24 pb-12">
      {/* Floating circular logo badge */}
      <div className="absolute left-1/2 -top-16 -translate-x-1/2 w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm flex items-center justify-center z-10">
        <Image
          src="/solar/icons/Demoinnlogo.svg"
          alt="Demoinn Logo"
          width={160}
          height={160}
          className="w-full h-full object-contain p-4 rotate-[10.8deg]"
        />
      </div>

      <Container className="max-w-7xl">
        <div className="grid gap-20 lg:grid-cols-4 items-start px-16 py-10">
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
          <div className="space-y-10">
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
          <div>
            <h4 className="font-semibold text-[#EFBE9F] mb-6 text-xl">
              ¡Déjanos tu correo y te escribimos en breve!
            </h4>
            <form onSubmit={handleSubmit} className="max-w-md">
              <div className="flex items-center h-14 sm:h-16 rounded-full border-2 border-[#AAB3FF] bg-[#6D73B3]/35 overflow-hidden">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreoaquí@correo.com"
                  className="flex-1 bg-transparent px-6 outline-none placeholder:text-[#E1E6FD]/35 text-[#E1E6FD]/80 text-sm sm:text-base h-full"
                  aria-label="Email para newsletter"
                />
                <button
                  type="submit"
                  className="h-full px-10 sm:px-12 rounded-full bg-[#E79A5A] text-white font-bold text-lg sm:text-xl tracking-wide hover:bg-[#E79A5A]/90 transition-colors whitespace-nowrap"
                >
                  ENVIAR
                </button>
              </div>
            </form>
          </div>
        </div>
      </Container>

      {/* Separator line with circular node - Full width */}
      <div className="mt-12 w-full h-20 sm:h-24 md:h-28">
        <Image
          src="/solar/icons/footerLine.svg"
          alt="Footer separator line"
          width={1867}
          height={105}
          className="w-full h-full object-contain object-left"
        />
      </div>

      <Container className="max-w-7xl">
        {/* Copyright */}
        <div className="mt-10 text-center text-sm text-[#E1E6FD]/70 px-16">
          <p>© {currentYear}. Todos los derechos reservados</p>
        </div>
      </Container>
    </footer>
  );
}
