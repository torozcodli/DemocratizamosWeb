/**
 * Fuente de datos única para Programas
 * 
 * Esta estructura está diseñada para ser fácilmente reemplazable
 * por datos de BD en el futuro sin romper los componentes.
 */

export interface ProgramaInfo {
  date: string;
  time: string;
  location: string;
  instructor: string;
  duration: string;
  level: string;
  includes: string;
}

export interface Programa {
  slug: string;
  title: string;
  shortDescription: string;
  imageSrc: string; // Misma imagen para card y detalle
  content: string[]; // Párrafos de la descripción larga
  info: ProgramaInfo;
  ctaText?: string; // Default: "Reserva mi lugar"
  ctaHref?: string; // Default: WhatsApp link
}

export const PROGRAMAS: Programa[] = [
  {
    slug: 'inclusion-digital',
    title: 'Inclusión digital',
    shortDescription: 'Transformamos vidas a través de la tecnología en Chihuahua.',
    imageSrc: '/images/Proyecto_InclusionDigital.jpg',
    content: [
      'En un mundo cada vez más digitalizado, la brecha tecnológica se convierte en una barrera que limita el acceso a oportunidades. Nuestro programa de Inclusión Digital está diseñado para cerrar esta brecha, llevando habilidades digitales esenciales a comunidades que históricamente han tenido acceso limitado a la tecnología.',
      'A través de talleres prácticos, capacitaciones personalizadas y recursos accesibles, empoderamos a personas de todas las edades para que puedan navegar con confianza en el mundo digital. Desde habilidades básicas de computación hasta herramientas avanzadas de comunicación y productividad, nuestro enfoque integral garantiza que cada participante desarrolle competencias que transformarán su vida personal y profesional.',
      'Creemos firmemente que la tecnología debe ser un derecho, no un privilegio. Por eso, trabajamos directamente con comunidades locales, adaptando nuestros programas a las necesidades específicas de cada grupo y garantizando que el conocimiento se traduzca en oportunidades reales de crecimiento y desarrollo.',
    ],
    info: {
      date: '7 de enero 2026',
      time: '5:00 pm',
      location: 'Tecnológico de Monterrey',
      instructor: 'Lorem Ipsum',
      duration: '2 horas',
      level: 'Principiante',
      includes: 'Material digital y acceso posterior',
    },
    ctaText: 'Reserva mi lugar',
    ctaHref: 'https://wa.me/+5216145871758',
  },
  {
    slug: 'desigualdad-reducida',
    title: 'Desigualdad Reducida',
    shortDescription: 'Aprovechamos tecnología para disminuir la desigualdad en recursos.',
    imageSrc: '/images/500.jpg',
    content: [
      'La desigualdad en el acceso a recursos tecnológicos y educativos es uno de los mayores desafíos de nuestro tiempo. Nuestro programa de Desigualdad Reducida aborda este problema de manera integral, utilizando la tecnología como herramienta de empoderamiento y transformación social.',
      'Trabajamos con comunidades marginadas para proporcionar acceso a herramientas digitales, capacitación en habilidades técnicas y oportunidades de desarrollo profesional. Nuestro modelo de intervención se basa en la creación de ecosistemas de aprendizaje colaborativo donde los participantes no solo adquieren conocimientos, sino que también construyen redes de apoyo mutuo.',
      'A través de alianzas estratégicas con instituciones educativas, empresas locales y organizaciones comunitarias, creamos programas sostenibles que generan impacto a largo plazo. Cada proyecto está diseñado para ser escalable y replicable, maximizando nuestro alcance y garantizando que más personas puedan beneficiarse de las oportunidades que ofrece la tecnología.',
    ],
    info: {
      date: '14 de enero 2026',
      time: '6:00 pm',
      location: 'Centro Comunitario',
      instructor: 'Jane Doe',
      duration: '3 horas',
      level: 'Intermedio',
      includes: 'Certificado y materiales físicos',
    },
    ctaText: 'Reserva mi lugar',
    ctaHref: 'https://wa.me/+5216145871758',
  },
  {
    slug: 'transformacion-social',
    title: 'Transformación Social',
    shortDescription: 'Impulsamos proyectos que mejoran la calidad de vida comunitaria.',
    imageSrc: '/images/CapacitacionCiber.jpg',
    content: [
      'La transformación social requiere más que tecnología: requiere visión, compromiso y acción colectiva. Nuestro programa de Transformación Social conecta la innovación tecnológica con las necesidades reales de las comunidades, creando soluciones que generan cambios tangibles y duraderos.',
      'Trabajamos directamente con líderes comunitarios, organizaciones locales y ciudadanos comprometidos para identificar desafíos específicos y desarrollar proyectos tecnológicos que aborden estas necesidades. Desde aplicaciones móviles para mejorar servicios comunitarios hasta plataformas digitales que facilitan la comunicación y colaboración, cada proyecto está diseñado para generar impacto real.',
      'Nuestro enfoque participativo garantiza que las comunidades sean dueñas de su transformación digital. No imponemos soluciones desde fuera, sino que co-creamos con los participantes, asegurando que cada herramienta y cada programa responda genuinamente a las necesidades y aspiraciones locales. El resultado es un cambio sostenible que empodera a las comunidades para construir su propio futuro digital.',
    ],
    info: {
      date: '21 de enero 2026',
      time: '4:00 pm',
      location: 'Espacio de Innovación',
      instructor: 'John Smith',
      duration: '4 horas',
      level: 'Avanzado',
      includes: 'Proyecto práctico y mentoría',
    },
    ctaText: 'Reserva mi lugar',
    ctaHref: 'https://wa.me/+5216145871758',
  },
  {
    slug: 'tecnologia-accesible',
    title: 'Tecnología accesible',
    shortDescription: 'Facilitamos el acceso a herramientas digitales para todos.',
    imageSrc: '/images/Proyecto_TecnologiaAccesible.jpg',
    content: [
      'La accesibilidad tecnológica no es solo una cuestión de disponibilidad, sino de diseño inclusivo y adaptación a diferentes necesidades. Nuestro programa de Tecnología Accesible está dedicado a garantizar que las herramientas digitales sean verdaderamente accesibles para todas las personas, independientemente de sus habilidades, edad o contexto socioeconómico.',
      'Desarrollamos y adaptamos tecnologías que eliminan barreras físicas, cognitivas y económicas. Trabajamos con personas con discapacidades, adultos mayores, comunidades rurales y cualquier grupo que tradicionalmente haya sido excluido del mundo digital. Nuestro enfoque se basa en el diseño universal y la adaptación personalizada.',
      'Más allá de proporcionar acceso, enseñamos a las personas a crear y adaptar sus propias soluciones tecnológicas. Empoderamos a los participantes para que no solo sean consumidores de tecnología, sino creadores activos de herramientas que respondan a sus necesidades específicas. Este enfoque transforma la relación entre las personas y la tecnología, convirtiéndola en una herramienta verdaderamente democrática y accesible.',
    ],
    info: {
      date: '28 de enero 2026',
      time: '5:30 pm',
      location: 'Biblioteca Digital',
      instructor: 'María García',
      duration: '2.5 horas',
      level: 'Principiante',
      includes: 'Dispositivos de préstamo y guías',
    },
    ctaText: 'Reserva mi lugar',
    ctaHref: 'https://wa.me/+5216145871758',
  },
];

/**
 * Busca un programa por su slug
 */
export function getProgramaBySlug(slug: string): Programa | undefined {
  return PROGRAMAS.find((programa) => programa.slug === slug);
}

/**
 * Obtiene el índice de un programa en el arreglo
 */
export function getProgramaIndex(slug: string): number {
  return PROGRAMAS.findIndex((programa) => programa.slug === slug);
}

/**
 * Obtiene el programa anterior (si existe)
 * Basado en el orden del arreglo
 */
export function getPreviousPrograma(slug: string): Programa | null {
  const index = getProgramaIndex(slug);
  if (index <= 0) return null;
  return PROGRAMAS[index - 1];
}

/**
 * Obtiene el programa siguiente (si existe)
 * Basado en el orden del arreglo
 */
export function getNextPrograma(slug: string): Programa | null {
  const index = getProgramaIndex(slug);
  if (index < 0 || index >= PROGRAMAS.length - 1) return null;
  return PROGRAMAS[index + 1];
}
