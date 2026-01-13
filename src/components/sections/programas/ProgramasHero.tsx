'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { WhatsAppBanner } from '@/components/ui/WhatsAppBanner';

export function ProgramasHero() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/programas?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative w-full overflow-hidden h-[520px] sm:h-[600px] lg:h-[680px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/ProgramasPortada.jpg"
          alt="Programas - Democratizamos la Innovación"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      </div>

      {/* Overlay círculo grande morado/azulado */}
      <div className="absolute left-1/2 bottom-[-240px] md:bottom-[-260px] lg:bottom-[-280px] -translate-x-1/2 z-10 w-[320px] h-[320px] md:w-[520px] md:h-[520px] lg:w-[640px] lg:h-[640px] rounded-full bg-gradient-to-br from-[#6F74C9]/85 via-[#9DACFF]/85 to-[#CED8F4]/85">
        {/* Pixeles decorativos dentro del círculo */}
        {/* Arriba izquierda */}
        <div className="absolute top-[15%] left-[12%] flex flex-col gap-1.5">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/60 rounded-sm"></div>
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white/50 rounded-sm"></div>
          <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/70 rounded-sm"></div>
        </div>
        {/* Derecha */}
        <div className="absolute top-[20%] right-[15%] flex flex-col gap-1.5">
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white/50 rounded-sm"></div>
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/60 rounded-sm"></div>
        </div>
        {/* Abajo izquierda */}
        <div className="absolute bottom-[25%] left-[18%] flex gap-1.5">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white/55 rounded-sm"></div>
          <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/65 rounded-sm"></div>
        </div>
        {/* Abajo derecha */}
        <div className="absolute bottom-[20%] right-[20%] flex gap-1.5">
          <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/60 rounded-sm"></div>
          <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-white/50 rounded-sm"></div>
        </div>
      </div>

      {/* Círculo pequeño durazno/salmón */}
      <div className="absolute left-[384px] md:left-[444px] lg:left-[504px] bottom-[-10px] md:bottom-[50px] lg:bottom-[80px] z-20 w-[90px] h-[90px] md:w-[120px] md:h-[120px] lg:w-[150px] lg:h-[150px] rounded-full bg-gradient-to-br from-[#FF8948] via-[#FF9A5A] to-[#FFD1BD] shadow-[0_0_20px_rgba(255,137,72,0.6),0_0_40px_rgba(255,154,90,0.4)]"></div>

      {/* SVG buscador centrado */}
      <div className="absolute left-1/2 bottom-[10px] md:bottom-[70px] lg:bottom-[100px] -translate-x-1/2 z-30 w-[270px] md:w-[420px] lg:w-[520px] max-w-[90vw]">
        <form onSubmit={handleSearch} className="relative w-full">
          {/* SVG de fondo */}
          <div className="relative w-full">
            <Image
              src="/solar/icons/programas-searchbar.svg"
              alt="Buscar programas"
              width={637}
              height={134}
              className="w-full h-auto"
              style={{ width: '100%', height: 'auto' }}
              priority
            />
            
            {/* Input transparente encima del SVG para capturar texto - en la parte baja donde está el texto */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder=""
              className="absolute left-[10%] bottom-[15%] w-[78%] h-[35%] bg-transparent border-none outline-none text-[#1E1A49] text-sm md:text-base lg:text-lg font-medium placeholder:text-transparent focus:outline-none"
              aria-label="Buscar programas"
            />
          </div>
        </form>
      </div>

      {/* WhatsApp Banner flotante */}
      <div className="absolute bottom-4 md:bottom-8 lg:bottom-12 right-0 md:right-0 lg:right-0 z-20" style={{ transform: 'translateX(15px)' }}>
        <WhatsAppBanner />
      </div>
    </section>
  );
}
