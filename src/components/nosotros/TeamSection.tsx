import { getTranslations } from 'next-intl/server';
import { TeamCard } from './TeamCard';

const teamFrameUrls = [
  '/solar/icons/Pau.svg',
  '/solar/icons/Dani.svg',
  '/solar/icons/Santi.svg',
  '/solar/icons/Tomy.svg',
  '/solar/icons/Xochitl.svg',
  '/solar/icons/Silvia.svg',
];
const teamLinkedInUrls = [
  'https://www.linkedin.com/in/paulina-garcia-saenz-a88762261/',
  'https://www.linkedin.com/in/dany-garcia/',
  'https://www.linkedin.com/in/daniel-santiesteban-453875131/',
  'https://www.linkedin.com/in/tomas-orozco-9b5023224',
  'https://www.linkedin.com/in/xochitl-castillo-d-12271410a/',
  '#',
];

export async function TeamSection() {
  const t = await getTranslations('nosotros.team');
  const members = t.raw('members') as Array<{ role: string; name: string }>;
  const firstRow = members.slice(0, 3);
  const secondRow = members.slice(3, 6);

  return (
    <section className="w-full bg-gradient-to-b from-[#090828] via-[#131039] to-[#1D194C] py-16 md:py-20 overflow-x-clip">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-white text-4xl md:text-5xl font-tech-alt font-extrabold tracking-tight mb-12 md:mb-16">
          {t('title')}
        </h2>

        <div className="hidden md:block">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 mb-10 md:mb-12">
            {firstRow.map((member, i) => (
              <TeamCard
                key={member.name + i}
                frameSrc={teamFrameUrls[i]}
                role={member.role}
                name={member.name}
                linkedinUrl={teamLinkedInUrls[i]}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {secondRow.map((member, i) => (
              <TeamCard
                key={member.name + (i + 3)}
                frameSrc={teamFrameUrls[i + 3]}
                role={member.role}
                name={member.name}
                linkedinUrl={teamLinkedInUrls[i + 3]}
              />
            ))}
          </div>
        </div>

        <div className="md:hidden space-y-10">
          {members.map((member, i) => (
            <TeamCard
              key={member.name + i}
              frameSrc={teamFrameUrls[i]}
              role={member.role}
              name={member.name}
              linkedinUrl={teamLinkedInUrls[i]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
