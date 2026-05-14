export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

const gaEnabled = () =>
  typeof window !== 'undefined' && !!GA_TRACKING_ID && GA_TRACKING_ID !== 'G-XXXXXXXXXX';

export const pageview = (url: string) => {
  if (!gaEnabled()) return;
  window.gtag?.('config', GA_TRACKING_ID, { page_path: url });
};

interface EventParams {
  action: string;
  category: string;
  label?: string;
  value?: number;
  // Additional GA4 params
  [key: string]: unknown;
}

export const event = ({ action, category, label, value, ...rest }: EventParams) => {
  if (!gaEnabled()) return;
  window.gtag?.('event', action, {
    event_category: category,
    event_label: label,
    value,
    ...rest,
  });
  // Mirror to Meta Pixel for paid traffic feedback when relevant.
  if (typeof window !== 'undefined' && window.fbq && (action === 'quote_form_complete' || action === 'lead_submitted')) {
    window.fbq('track', 'Lead', { content_category: label });
  }
};

// ─── Quote funnel events ───────────────────────────────────────────────
export const trackQuoteFormView = (product: string) =>
  event({ action: 'quote_form_view', category: 'quote_funnel', label: product, product });

export const trackQuoteFormStart = (product: string) =>
  event({ action: 'quote_form_start', category: 'quote_funnel', label: product, product });

export const trackQuoteStep1Complete = (product: string) =>
  event({ action: 'quote_form_step_1_complete', category: 'quote_funnel', label: product, product });

export const trackQuoteStep2Start = (product: string) =>
  event({ action: 'quote_form_step_2_start', category: 'quote_funnel', label: product, product });

export const trackQuoteFormComplete = (product: string, score?: number) =>
  event({
    action: 'quote_form_complete',
    category: 'quote_funnel',
    label: product,
    value: score,
    product,
  });

export const trackQuoteFormAbandon = (product: string, step: 1 | 2) =>
  event({ action: 'quote_form_abandon', category: 'quote_funnel', label: `${product}_step_${step}`, product, step });

export const trackQuoteFormError = (product: string, error: string) =>
  event({ action: 'quote_form_error', category: 'quote_funnel', label: `${product}: ${error}`, product });

export const trackInsuranceQuoteIntent = (product: string) =>
  event({ action: 'insurance_quote_intent', category: 'conversion', label: product, product });

// ─── General inquiry form (kept for /iletisim) ─────────────────────────
export const trackInquiryFormStart = () =>
  event({ action: 'inquiry_form_start', category: 'engagement', label: 'contact_form' });

export const trackInquiryFormComplete = () =>
  event({ action: 'inquiry_form_complete', category: 'engagement', label: 'contact_form' });

export const trackInquiryFormError = (error: string) =>
  event({ action: 'inquiry_form_error', category: 'engagement', label: error });

// ─── CTA click tracking ────────────────────────────────────────────────
export const trackWhatsappClick = (location: string, product?: string) =>
  event({ action: 'whatsapp_click', category: 'cta', label: location, product });

export const trackPhoneClick = (location: string) =>
  event({ action: 'phone_click', category: 'cta', label: location });

export const trackEmailClick = () =>
  event({ action: 'email_click', category: 'cta', label: 'email_address' });

export const trackCTAClick = (ctaName: string, location: string) =>
  event({ action: 'cta_click', category: 'cta', label: `${ctaName} - ${location}` });

// ─── Engagement ────────────────────────────────────────────────────────
export const trackInsuranceCardClick = (product: string) =>
  event({ action: 'insurance_card_click', category: 'engagement', label: product, product });

export const trackBlogPostView = (postTitle: string) =>
  event({ action: 'blog_post_view', category: 'engagement', label: postTitle });

export const trackBlogCategoryClick = (category: string) =>
  event({ action: 'blog_category_click', category: 'engagement', label: category });

export const trackNavigationClick = (linkName: string) =>
  event({ action: 'navigation_click', category: 'engagement', label: linkName });

export const trackSocialClick = (platform: string) =>
  event({ action: 'social_click', category: 'engagement', label: platform });

export const trackScrollDepth = (depth: number) =>
  event({ action: 'scroll_depth', category: 'engagement', label: `${depth}%`, value: depth });

export const trackTimeOnPage = (seconds: number) =>
  event({ action: 'time_on_page', category: 'engagement', label: `${seconds}s`, value: seconds });

// ─── Lead magnets / popups ─────────────────────────────────────────────
export const trackLeadCalcUse = (calc: string) =>
  event({ action: 'lead_calc_use', category: 'lead_magnet', label: calc });

export const trackExitIntentShow = () =>
  event({ action: 'exit_intent_show', category: 'lead_magnet', label: 'exit_modal' });

export const trackExitIntentConvert = () =>
  event({ action: 'exit_intent_convert', category: 'lead_magnet', label: 'exit_modal' });

// ─── Final lead event ──────────────────────────────────────────────────
export const trackLeadSubmitted = (product: string, source?: string, score?: number) =>
  event({
    action: 'lead_submitted',
    category: 'conversion',
    label: product,
    value: score,
    product,
    source,
  });
