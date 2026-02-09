export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Google Analytics pageview
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
    window.gtag?.('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Generic event tracking
interface EventParams {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const event = ({ action, category, label, value }: EventParams) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID && GA_TRACKING_ID !== 'G-XXXXXXXXXX') {
    window.gtag?.('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Contact form tracking
export const trackContactFormStart = () => {
  event({
    action: 'form_start',
    category: 'engagement',
    label: 'contact_form',
  });
};

export const trackContactFormComplete = () => {
  event({
    action: 'form_complete',
    category: 'engagement',
    label: 'contact_form',
  });
};

export const trackContactFormError = (error: string) => {
  event({
    action: 'form_error',
    category: 'engagement',
    label: error,
  });
};

// Phone/Email click tracking
export const trackPhoneClick = () => {
  event({
    action: 'phone_click',
    category: 'engagement',
    label: 'phone_number',
  });
};

export const trackEmailClick = () => {
  event({
    action: 'email_click',
    category: 'engagement',
    label: 'email_address',
  });
};

// Course tracking
export const trackCourseClick = (courseName: string) => {
  event({
    action: 'course_click',
    category: 'engagement',
    label: courseName,
  });
};

export const trackCourseInterest = (courseName: string) => {
  event({
    action: 'course_interest',
    category: 'conversion',
    label: courseName,
  });
};

// Blog tracking
export const trackBlogPostView = (postTitle: string) => {
  event({
    action: 'blog_post_view',
    category: 'engagement',
    label: postTitle,
  });
};

export const trackBlogCategoryClick = (category: string) => {
  event({
    action: 'blog_category_click',
    category: 'engagement',
    label: category,
  });
};

// Navigation tracking
export const trackNavigationClick = (linkName: string) => {
  event({
    action: 'navigation_click',
    category: 'engagement',
    label: linkName,
  });
};

// Social media tracking
export const trackSocialClick = (platform: string) => {
  event({
    action: 'social_click',
    category: 'engagement',
    label: platform,
  });
};

// Scroll depth tracking
export const trackScrollDepth = (depth: number) => {
  event({
    action: 'scroll_depth',
    category: 'engagement',
    label: `${depth}%`,
    value: depth,
  });
};

// Time on page tracking
export const trackTimeOnPage = (seconds: number) => {
  event({
    action: 'time_on_page',
    category: 'engagement',
    label: `${seconds} seconds`,
    value: seconds,
  });
};

// CTA tracking
export const trackCTAClick = (ctaName: string, location: string) => {
  event({
    action: 'cta_click',
    category: 'engagement',
    label: `${ctaName} - ${location}`,
  });
};
