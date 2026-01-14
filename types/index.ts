export interface CoverPageData {
  title: string;
  titleAccent: string;
  subtitle: string;
  clientName: string;
  clientAddress: string;
  clientCity: string;
}

export interface TemplateConfig {
  // Company Info
  companyName: string;
  companyTagline: string;
  contactEmail: string;
  website: string;
  logoUrl: string;

  // Colors
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  mutedColor: string;
  backgroundColor: string;

  // Typography
  fontFamily: string;
  baseFontSize: string;

  // Header
  showQuoteNumber: boolean;
  showDate: boolean;
  showValidityPeriod: boolean;
  validityDays: number;
  quotePrefix: string;

  // Footer
  footerText: string;
  showFooter: boolean;

  // Spacing
  pagePadding: string;
}

export interface ExportConfig {
  pageSize: 'a4' | 'letter' | 'legal';
  orientation: 'portrait' | 'landscape';
  filename: string;
  quality: 'draft' | 'standard' | 'high';
  includeDate: boolean;
}

export interface Quote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface StorageData {
  currentDraft: string;
  template: TemplateConfig;
  quotes: Quote[];
  lastQuoteNumber: number;
}
