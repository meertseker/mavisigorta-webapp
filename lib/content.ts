import fs from 'fs';
import path from 'path';
import { Course, Instructor, SiteSettings } from './types';

const contentDirectory = path.join(process.cwd(), 'content');

export function getCourses(): Course[] {
  try {
    const filePath = path.join(contentDirectory, 'courses.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading courses.json:', error);
    return [];
  }
}

export function getCourseById(id: string): Course | null {
  const courses = getCourses();
  return courses.find((course) => course.id === id) || null;
}

export function getPopularCourses(): Course[] {
  return getCourses().filter((course) => course.popular);
}

export function getInstructors(): Instructor[] {
  try {
    const filePath = path.join(contentDirectory, 'instructors.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading instructors.json:', error);
    return [];
  }
}

export function getInstructorById(id: string): Instructor | null {
  const instructors = getInstructors();
  return instructors.find((instructor) => instructor.id === id) || null;
}

export function getSiteSettings(): SiteSettings {
  try {
    const filePath = path.join(contentDirectory, 'settings.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error('Error reading settings.json:', error);
    // Return default settings if file doesn't exist
    return {
      siteName: 'Efe Sürücü Kursu',
      logo: '/images/logo.png',
      contact: {
        phone: '+90 (212) 555 0123',
        email: 'info@efesurucukursu.com',
        address: 'Büyükçekmece, İstanbul',
        fullAddress: 'Cumhuriyet Mahallesi, Atatürk Caddesi No: 123, Büyükçekmece/İstanbul',
        mapEmbed: '',
      },
      socialMedia: {},
      workingHours: {
        weekdays: '09:00 - 19:00',
        saturday: '09:00 - 17:00',
        sunday: 'Kapalı',
      },
      seo: {
        title: 'Efe Sürücü Kursu',
        description: 'İstanbul Büyükçekmece Sürücü Kursu',
        keywords: [],
      },
      features: [],
      stats: {
        yearsOfExperience: 15,
        successRate: 95,
        totalStudents: 5000,
        instructors: 8,
      },
    };
  }
}
