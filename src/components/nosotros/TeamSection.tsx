import { TeamCard } from './TeamCard';

const teamMembers = [
  {
    frameSrc: '/solar/icons/Pau.svg',
    role: 'Representante Legal.',
    name: 'Paulina García',
    linkedinUrl: 'https://www.linkedin.com/in/paulina-garcia-saenz-a88762261/',
  },
  {
    frameSrc: '/solar/icons/Dani.svg',
    role: 'Director',
    name: 'Daniel García',
    linkedinUrl: 'https://www.linkedin.com/in/dany-garcia/',
  },
  {
    frameSrc: '/solar/icons/Santi.svg',
    role: 'Coordinador de Operaciones',
    name: 'Daniel Santiesteban',
    linkedinUrl: 'https://www.linkedin.com/in/daniel-santiesteban-453875131/',
  },
  {
    frameSrc: '/solar/icons/Tomy.svg',
    role: 'Ing. Automatización de Procesos',
    name: 'Tomás Orozco',
    linkedinUrl: 'https://www.linkedin.com/in/tomas-orozco-9b5023224',
  },
  {
    frameSrc: '/solar/icons/Xochitl.svg',
    role: 'Coordinadora Administrativa',
    name: 'Xochitl Castillo',
    linkedinUrl: 'https://www.linkedin.com/in/xochitl-castillo-d-12271410a/',
  },
  {
    frameSrc: '/solar/icons/Silvia.svg',
    role: '',
    name: 'Silvia',
    linkedinUrl: '#', // TODO: agregar URL de LinkedIn cuando la pases
  },
];

export function TeamSection() {
  const firstRow = teamMembers.slice(0, 3);
  const secondRow = teamMembers.slice(3, 6);

  return (
    <section className="w-full bg-gradient-to-b from-[#090828] via-[#131039] to-[#1D194C] py-16 md:py-20 overflow-x-clip">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-center text-white text-4xl md:text-5xl font-tech-alt font-extrabold tracking-tight mb-12 md:mb-16">
          Nuestro equipo.
        </h2>

        {/* Desktop/Tablet: 3 cards top, 3 cards bottom */}
        <div className="hidden md:block">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 mb-10 md:mb-12">
            {firstRow.map((member) => (
              <TeamCard
                key={member.name}
                frameSrc={member.frameSrc}
                role={member.role}
                name={member.name}
                linkedinUrl={member.linkedinUrl}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {secondRow.map((member) => (
              <TeamCard
                key={member.name}
                frameSrc={member.frameSrc}
                role={member.role}
                name={member.name}
                linkedinUrl={member.linkedinUrl}
              />
            ))}
          </div>
        </div>

        {/* Mobile Layout: 1 column vertical */}
        <div className="md:hidden space-y-10">
          {teamMembers.map((member) => (
            <TeamCard
              key={member.name}
              frameSrc={member.frameSrc}
              role={member.role}
              name={member.name}
              linkedinUrl={member.linkedinUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
