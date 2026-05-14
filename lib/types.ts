// Insurance product taxonomy
export type InsuranceSlug =
  | 'tamamlayici-saglik'
  | 'moduler-saglik'
  | 'kasko'
  | 'trafik'
  | 'konut'
  | 'isyeri'
  | 'dask'
  | 'seyahat-saglik';

export type InsuranceCategory = 'saglik' | 'arac' | 'mulkiyet' | 'seyahat';

export interface Insurance {
  id: InsuranceSlug;
  title: string;
  shortTitle: string;
  description: string;
  category: InsuranceCategory;
  duration: string;
  features: string[];
  image: string;
  popular?: boolean;
  // Indicative annual price range used for landing pages and quote estimator hints.
  priceRange?: {
    min: number;
    max: number;
    unit: 'yillik' | 'aylik';
  };
  // Inline FAQ entries shown on the per-product page.
  faqs?: { question: string; answer: string }[];
}

// Lead types ---------------------------------------------------------------

export type LeadSource = 'organic' | 'ads' | 'whatsapp' | 'direct' | 'referral' | 'social';

export type LeadStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost';

export interface QuoteFormStep1 {
  // Free-form per-product payload (e.g. plate, age, m2).
  [key: string]: string | number | boolean | undefined;
}

export interface LeadInput {
  product: InsuranceSlug | 'genel';
  name: string;
  phone: string;
  email?: string;
  city?: string;
  message?: string;
  kvkkConsent: boolean;
  marketingConsent?: boolean;
  step1?: QuoteFormStep1;
  source?: LeadSource;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
}

// Blog Post Types ----------------------------------------------------------
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  excerpt: string;
  published?: boolean;
  content: string;
}

export interface BlogPostMetadata {
  title: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  image: string;
  excerpt: string;
  published?: boolean;
}

// Agent (Soner Bey, single agent) ------------------------------------------
export interface Agent {
  id: string;
  name: string;
  title: string;
  yearsActive: number;
  photo: string;
  bio: string;
  specialties: string[];
  phone: string;
  whatsapp: string;
  email: string;
}

// Site Settings ------------------------------------------------------------
export interface SiteSettings {
  siteName: string;
  logo: string;
  contact: {
    phone: string;
    whatsapp: string;
    email: string;
    address: string;
    fullAddress: string;
    mapEmbed: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
  workingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  features: Feature[];
  stats: {
    yearsOfExperience: number;
    successRate: number;
    customersServed: number;
    agentYearsActive: number;
    partnerCompanies: number;
  };
  partners: Partner[];
  companyInfo: {
    owner: string;
    fullName: string;
    description: string;
  };
}

export interface Feature {
  name: string;
  description: string;
  icon: string;
}

export interface Partner {
  name: string;
  logo: string;
  category?: InsuranceCategory[];
}

// Generic inquiry contact form (preserved for /iletisim) -------------------
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  insuranceType?: string;
  kvkkConsent: boolean;
  marketingConsent?: boolean;
}
