export type SumaImpactoLiteExperience = {
  id?: string;
  name?: string;
  types?: string[];
  description?: string;
  startDate?: string | null;
  endDate?: string | null;
  closingDate?: string | null;
  organization?: string;
  publicUrl?: string;
  organizationSlug?: string;
  location?: string | null;
  modality?: string | null;
  imageUrl?: string | null;
  registrationUrl?: string;
  reserveUrl?: string;
  shortLinkUrl?: string | null;
  cost?: string | null;
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
  startDate?: string | null;
  endDate?: string | null;
  closingDate?: string | null;
  category?: string;
  location?: string;
  organizationName?: string;
  costLabel?: string;
  href: string;
  ctaHref: string;
};
