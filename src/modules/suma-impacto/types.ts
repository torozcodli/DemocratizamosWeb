import type { SumaImpactoLiteItem } from './schema';

export type SumaImpactoLiteResponse = {
  success: boolean;
  total: number;
  data: SumaImpactoLiteItem[];
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
