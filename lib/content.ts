import fs from 'fs';
import path from 'path';
import { Agent, Insurance, InsuranceSlug, SiteSettings } from './types';

const contentDirectory = path.join(process.cwd(), 'content');

export function getInsurances(): Insurance[] {
  try {
    const filePath = path.join(contentDirectory, 'insurances.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as Insurance[];
  } catch (error) {
    console.error('Error reading insurances.json:', error);
    return [];
  }
}

export function getInsuranceById(id: string): Insurance | null {
  const insurances = getInsurances();
  return insurances.find((ins) => ins.id === id) || null;
}

export function getFlagshipInsurances(): Insurance[] {
  return getInsurances().filter((ins) => ins.popular);
}

export function getAllInsuranceSlugs(): InsuranceSlug[] {
  return getInsurances().map((i) => i.id);
}

export function getAgent(): Agent {
  try {
    const filePath = path.join(contentDirectory, 'agent.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as Agent;
  } catch (error) {
    console.error('Error reading agent.json:', error);
    return {
      id: 'soner-seker',
      name: 'Soner Şeker',
      title: 'Sigorta Acentesi',
      yearsActive: 25,
      photo: '/images/instructors/soner-seker.jpg',
      bio: '',
      specialties: [],
      phone: '0532 480 76 17',
      whatsapp: '905324807617',
      email: 'info@mavisigorta.net',
    };
  }
}

export function getSiteSettings(): SiteSettings {
  try {
    const filePath = path.join(contentDirectory, 'settings.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents) as SiteSettings;
  } catch (error) {
    console.error('Error reading settings.json:', error);
    return {
      siteName: 'Mavi Sigorta',
      logo: '/logo.png',
      contact: {
        phone: '0532 480 76 17',
        whatsapp: '905324807617',
        email: 'info@mavisigorta.net',
        address: 'Beylikdüzü, İstanbul',
        fullAddress: 'Beylikdüzü, İstanbul',
        mapEmbed: '',
      },
      socialMedia: {},
      workingHours: {
        weekdays: '09:00 - 19:00',
        saturday: '09:00 - 17:00',
        sunday: 'Kapalı',
      },
      seo: {
        title: 'Mavi Sigorta',
        description: 'İstanbul Beylikdüzü sigorta acentesi',
        keywords: [],
      },
      features: [],
      stats: {
        yearsOfExperience: 25,
        successRate: 98,
        customersServed: 10000,
        agentYearsActive: 25,
        partnerCompanies: 8,
      },
      partners: [],
      companyInfo: {
        owner: 'Soner Şeker',
        fullName: 'Mavi Sigorta Allianz Aracılık Hizmetleri',
        description: '',
      },
    };
  }
}
