'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Tool {
  _id: string;
  title: string;
  slug: string;
  imageUrl: string;
  description: string;
  date: string;
}

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Link href={`/herramientas/${tool.slug}`} prefetch={false} className="group block h-full">
        <article className="rounded-[32px] overflow-hidden shadow-lg transition-transform duration-200 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
          {/* Sección imagen (arriba) */}
          <div className="relative w-full h-[170px] sm:h-[190px] md:h-[200px] overflow-hidden">
            <Image
              src={tool.imageUrl}
              alt={tool.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              unoptimized={tool.imageUrl.startsWith('/images/') || tool.imageUrl.startsWith('/')}
            />
          </div>

          {/* Sección contenido (abajo) - Fondo lavanda que cambia en hover */}
          <div className="px-6 py-5 bg-[#9DACFD] transition-colors duration-300 group-hover:bg-[#484A88] flex-1 flex flex-col">
            {/* Meta row: fecha */}
            <div className="text-white/80 text-sm">
              {formatDate(tool.date)}
            </div>

            {/* Título - Cambia a naranja en hover */}
            <h3 className="mt-2 text-white font-extrabold text-xl leading-tight line-clamp-2 transition-colors duration-300 group-hover:text-[#E68956]">
              {tool.title}
            </h3>

            {/* Descripción */}
            <p className="mt-3 text-white/90 text-sm line-clamp-2 flex-1">
              {tool.description}
            </p>

            {/* Botón "Conoce más" */}
            <div className="mt-auto pt-4">
              <button className="w-full rounded-full px-4 py-2.5 bg-[#1E1A49] text-white text-sm font-semibold hover:bg-[#484A88] transition-colors duration-300 group-hover:bg-[#484A88]">
                Conoce más
              </button>
            </div>
          </div>
        </article>
    </Link>
  );
}
