// Course Types
export type VehicleType = 'manuel' | 'otomatik' | 'both';

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  image: string;
  popular?: boolean;
  vehicleType: VehicleType;
}

// Blog Post Types
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

// Instructor Types
export interface Instructor {
  id: string;
  name: string;
  title: string;
  experience: string;
  photo: string;
  bio: string;
  specialties: string[];
}

// Site Settings Types
export interface SiteSettings {
  siteName: string;
  logo: string;
  contact: {
    phone: string;
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
    totalStudents: number;
    instructors: number;
  };
}

export interface Feature {
  name: string;
  description: string;
  icon: string;
}

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  courseInterest?: string;
}
