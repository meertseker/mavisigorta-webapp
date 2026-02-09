'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { event } from '@/lib/analytics';

export default function WebVitals() {
  useReportWebVitals((metric) => {
    if (metric.label === 'web-vital') {
      event({
        action: metric.name,
        category: 'Web Vitals',
        label: metric.id,
        value: Math.round(
          metric.name === 'CLS' ? metric.value * 1000 : metric.value
        ),
      });
    }
  });

  return null;
}
