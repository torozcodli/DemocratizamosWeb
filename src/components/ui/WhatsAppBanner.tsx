import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

export function WhatsAppBanner({ className }: { className?: string }) {
  const phoneNumber = '526141418003'; // sin "+"
  const message = encodeURIComponent('¡Hola! Me gustaría obtener más información.');

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        // IMPORTANTE: relative para que el círculo absolute se ancle aquí
        'relative z-20 hidden sm:flex items-center',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2',
        className
      )}
      aria-label="Contactar por WhatsApp - Resolvemos tus dudas"
    >
      {/* Rectángulo navy */}
      <div className="flex h-12 items-center rounded-lg bg-[#1E1A49] pl-14 pr-5 text-white shadow-lg border-2 border-[#A5B8FC]">
        <span className="whitespace-nowrap text-[16px] font-medium">
          ¡Resolvemos tus dudas!
        </span>
      </div>

      {/* Círculo WhatsApp montado */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 grid h-14 w-14 place-items-center rounded-full bg-[#37C463] ring-4 ring-[#E1E6FD] shadow-lg">
        <Image
          src="/images/WhatsApp.png"
          alt="WhatsApp"
          width={34}
          height={34}
          className="object-contain"
        />
      </div>
    </a>
  );
}

