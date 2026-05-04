export type SumaImpactoLiteExperience = {
  id?: string;
  name?: string;
  types?: string[];
  description?: string;
  startDate?: string;
  endDate?: string;
  closingDate?: string;
  organization?: string;
  publicUrl?: string;
  organizationSlug?: string;
  location?: string | null;
  modality?: string | null;
  imageUrl?: string | null;
  registrationUrl?: string;
  reserveUrl?: string;
  shortLinkUrl?: string | null;
};

export type SumaImpactoLiteResponse = {
  success: boolean;
  total: number;
  data: SumaImpactoLiteExperience[];
};

export type DemocratizamosExperienceCard = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  startDate?: string;
  endDate?: string;
  closingDate?: string;
  category?: string;
  location?: string;
  href: string;
  ctaHref: string;
};
