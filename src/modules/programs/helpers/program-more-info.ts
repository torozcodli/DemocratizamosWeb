interface ProgramMoreInfoInput {
  slug: string;
  externalWebsiteUrl?: string;
}

interface ProgramMoreInfoResolution {
  href: string;
  isExternal: boolean;
}

export function resolveProgramMoreInfoDestination(
  program: ProgramMoreInfoInput
): ProgramMoreInfoResolution {
  const externalUrl = program.externalWebsiteUrl?.trim();

  if (externalUrl) {
    return {
      href: externalUrl,
      isExternal: true,
    };
  }

  return {
    href: `/programas/${program.slug}`,
    isExternal: false,
  };
}
