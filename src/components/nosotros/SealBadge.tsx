import Image from 'next/image';

interface SealBadgeProps {
  text: string; // "Misión" o "Visión"
}

export function SealBadge({ text }: SealBadgeProps) {
  return (
    <div className="absolute -top-12 left-6 md:left-10 w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 z-30">
      <div className="relative w-full h-full">
        {/* Círculo blanco con sombra */}
        <div className="absolute inset-0 rounded-full bg-white shadow-lg"></div>
        
        {/* Texto circular alrededor */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <path
              id={`circle-${text}`}
              d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
            />
          </defs>
          <text
            fontSize="8"
            fill="#1E1A49"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
          >
            <textPath href={`#circle-${text}`} startOffset="0%">
              {`${text} - ${text} - ${text} - ${text}`}
            </textPath>
          </text>
        </svg>
        
        {/* Logo centrado */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/solar/icons/Demologo.svg"
            alt="Demoinn Logo"
            width={40}
            height={40}
            className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14"
          />
        </div>
      </div>
    </div>
  );
}
