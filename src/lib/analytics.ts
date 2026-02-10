// GA4 Event Tracking for ADU Pulse

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackEvent(action: string, params?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, params)
  }
}

// Club signup
export function trackClubSignup(town?: string) {
  trackEvent('club_signup', { town: town || 'not_specified' })
}

// Builder form submission
export function trackBuilderSignup(company?: string) {
  trackEvent('builder_signup', { company: company || 'not_specified' })
}

// Town page view (beyond default pageview)
export function trackTownView(town: string) {
  trackEvent('town_view', { town })
}

// CTA clicks
export function trackCTAClick(cta: string, location: string) {
  trackEvent('cta_click', { cta, location })
}

// Tab switch (insights/permits on town pages)
export function trackTabSwitch(tab: string, town: string) {
  trackEvent('tab_switch', { tab, town })
}

// Show all towns expansion
export function trackShowAllTowns() {
  trackEvent('show_all_towns')
}

// Estimate calculator usage
export function trackEstimateStart(town?: string) {
  trackEvent('estimate_start', { town: town || 'not_specified' })
}

// Blog post view
export function trackBlogView(slug: string) {
  trackEvent('blog_view', { slug })
}
