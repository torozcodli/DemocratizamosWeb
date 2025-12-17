export const homeContent = {
  hero: {
    title: 'Transformamos vidas a través de la Tecnología.',
    description:
      'Llevando habilidades digitales a quienes más las necesitan, contribuyendo así a la inclusión digital y disminuyendo la desigualdad social.',
    cta: 'Contacto',
  },
  about: {
    card: {
      title: '¿Quiénes Somos?',
      text: 'Somos una asociación civil sin fines de lucro, comprometida con cerrar la brecha digital en México. Trabajamos para democratizar el acceso a la tecnología y las habilidades digitales, especialmente en comunidades vulnerables y marginadas.',
      additional:
        'A través de programas educativos, capacitaciones y proyectos colaborativos, creamos comunidades de aprendizaje que empoderan a las personas para transformar sus vidas y sus entornos mediante el uso responsable de la tecnología.',
    },
    heading: 'Creemos en el poder de la tecnología para todos.',
  },
  values: [
    {
      title: 'Educación y alfabetización digital',
      description: 'Capacitamos en habilidades digitales esenciales.',
    },
    {
      title: 'Colaboración y ecosistema',
      description: 'Construimos redes de apoyo y colaboración.',
    },
    {
      title: 'Inclusión digital y acceso equitativo',
      description: 'Garantizamos que todos tengan acceso a la tecnología.',
      highlight: true,
    },
    {
      title: 'Empleabilidad y emprendimiento',
      description: 'Preparamos para el mercado laboral digital.',
    },
    {
      title: 'Equidad y participación',
      description: 'Promovemos la igualdad de oportunidades.',
    },
    {
      title: 'Innovación con propósito social',
      description: 'Usamos la tecnología para el bien común.',
    },
  ],
  stats: [
    {
      value: '+2500',
      label: 'Personas capacitadas',
    },
    {
      value: '+190',
      label: 'Proyectos digitales elaborados',
    },
  ],
  allies: {
    title: 'Nuestros aliados.',
    subtitle: 'Valoramos a cada uno de nuestros aliados y colaboradores que hacen posible nuestro trabajo.',
    items: [
      { name: 'Aliado 1', logo: '/allies/placeholder-1.svg' },
      { name: 'Aliado 2', logo: '/allies/placeholder-2.svg' },
      { name: 'Aliado 3', logo: '/allies/placeholder-3.svg' },
      { name: 'Aliado 4', logo: '/allies/placeholder-4.svg' },
      { name: 'Aliado 5', logo: '/allies/placeholder-5.svg' },
    ],
  },
  news: {
    title: 'Lo más nuevo.',
    items: [
      {
        title: 'Capacitación en Ciberseguridad',
        description:
          'Programa intensivo para fortalecer las habilidades en seguridad digital y protección de datos personales.',
      },
      {
        title: 'Feria de Tecnología Social',
        description:
          'Evento comunitario donde presentamos proyectos tecnológicos con impacto social positivo.',
      },
      {
        title: 'Taller de Innovación Digital',
        description:
          'Espacio para desarrollar ideas innovadoras que resuelvan problemas locales mediante tecnología.',
      },
    ],
  },
} as const;

