'use client';

import { useEffect } from 'react';

export default function ProvisionViewTracker({ slug, provisionId }: { slug: string; provisionId: string }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.gtag?.('event', 'provision_detail_viewed', {
        event_category: 'engagement',
        event_label: `${slug}/${provisionId}`,
      });
    }
  }, [slug, provisionId]);

  return null;
}
