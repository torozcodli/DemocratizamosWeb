import { getTranslations } from 'next-intl/server';

export async function UbicacionSection() {
  const t = await getTranslations('nosotros.ubicacion');
  const locations = t.raw('locations') as Array<{ name: string; address: string }>;
  const mapQuery = encodeURIComponent(
    'Utopic Workspace Francisco Xavier Mina 1000 Int 9 Zona Centro 31000 Chihuahua Chih Mexico'
  );

  return (
    <section id="ubicacion" className="relative w-full bg-[#98A7FF] overflow-x-clip">
      <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] min-h-[520px] md:min-h-[560px]">
        <div className="relative w-full h-[320px] md:h-[420px] lg:h-auto">
          <iframe
            title="Mapa Utopic Workspace"
            className="absolute inset-0 w-full h-full"
            loading="lazy"
            style={{ border: 0 }}
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            allowFullScreen
          />
        </div>

        <div className="relative bg-[#98A7FF] px-6 py-8 md:px-8 md:py-10 lg:px-10 lg:py-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-tech font-extrabold text-[32px] md:text-[40px] lg:text-[48px] tracking-tight text-white">
              {t('title')}
            </h2>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>

          <p className="text-[#1D194C] text-[15px] md:text-[16px] leading-relaxed mb-8 max-w-[50ch]">
            {t('intro')}
          </p>

          <div className="mb-8">
            <h3 className="font-tech font-bold text-[20px] md:text-[22px] text-[#1D194C] mb-4">
              {t('city')}
            </h3>
            <ol className="space-y-4">
              {locations.map((location, i) => (
                <li key={location.name + i} className="flex gap-3">
                  <span className="font-bold text-[#1D194C] text-[16px] md:text-[17px] shrink-0">
                    {i + 1}.
                  </span>
                  <div className="flex-1">
                    <span className="font-semibold text-[#1D194C] text-[15px] md:text-[16px]">
                      {location.name}
                    </span>
                    <span className="text-[#1D194C]/80 text-[14px] md:text-[15px] leading-relaxed block mt-1">
                      {location.address}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="font-tech font-bold text-[20px] md:text-[22px] text-[#1D194C] mb-2">
              {t('scheduleTitle')}
            </h3>
            <p className="text-[#1D194C] text-[15px] md:text-[16px]">
              {t('schedule')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
