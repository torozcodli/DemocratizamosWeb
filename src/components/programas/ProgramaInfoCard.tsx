import { Calendar, Clock, MapPin } from 'lucide-react';
import type { Programa } from '@/data/programas';

interface ProgramaInfoCardProps {
  programa: Programa;
}

export function ProgramaInfoCard({ programa }: ProgramaInfoCardProps) {
  const { info } = programa;

  return (
    <div className="bg-[#9DACFD] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg border border-[#9DACFD]/30">
      <h2 className="text-[#1D194C] font-tech font-extrabold text-3xl sm:text-4xl mb-6 sm:mb-8">
        Información.
      </h2>

      <div className="space-y-5 sm:space-y-6">
        {/* Fecha con icono */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 text-[#1D194C] mt-0.5">
            <Calendar className="w-full h-full" />
          </div>
          <p className="text-[#1D194C] text-base sm:text-lg font-medium leading-relaxed">
            {info.date}
          </p>
        </div>

        {/* Hora con icono */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 text-[#1D194C] mt-0.5">
            <Clock className="w-full h-full" />
          </div>
          <p className="text-[#1D194C] text-base sm:text-lg font-medium leading-relaxed">
            {info.time}
          </p>
        </div>

        {/* Ubicación con icono */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 text-[#1D194C] mt-0.5">
            <MapPin className="w-full h-full" />
          </div>
          <p className="text-[#1D194C] text-base sm:text-lg font-medium leading-relaxed">
            {info.location}
          </p>
        </div>

        {/* Separador visual */}
        <div className="h-px bg-[#1D194C]/20 my-4"></div>

        {/* Información adicional sin iconos */}
        <div className="space-y-4">
          <div>
            <p className="text-[#1D194C] text-sm sm:text-base font-semibold mb-1">
              Instructor:
            </p>
            <p className="text-[#1D194C]/80 text-base sm:text-lg leading-relaxed">
              {info.instructor}
            </p>
          </div>

          <div>
            <p className="text-[#1D194C] text-sm sm:text-base font-semibold mb-1">
              Duración:
            </p>
            <p className="text-[#1D194C]/80 text-base sm:text-lg leading-relaxed">
              {info.duration}
            </p>
          </div>

          <div>
            <p className="text-[#1D194C] text-sm sm:text-base font-semibold mb-1">
              Nivel:
            </p>
            <p className="text-[#1D194C]/80 text-base sm:text-lg leading-relaxed">
              {info.level}
            </p>
          </div>

          <div>
            <p className="text-[#1D194C] text-sm sm:text-base font-semibold mb-1">
              Incluye:
            </p>
            <p className="text-[#1D194C]/80 text-base sm:text-lg leading-relaxed">
              {info.includes}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
