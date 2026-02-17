import type { ComplianceProvision } from '@/app/compliance/compliance-data'

export type Audience = 'homeowner' | 'builder' | 'lender'

export const AUDIENCE_LABELS: Record<Audience, string> = {
  homeowner: 'Homeowner',
  builder: 'Builder',
  lender: 'Lender',
}

export const AUDIENCE_STORAGE_KEY = 'adupulse_audience'

export const AUDIENCE_CONTENT: Record<Audience, {
  heroQuestion: string
  perCapitaLabel: string
  provisionBottomLineLabel: string
  provisionBottomLine: (provision: ComplianceProvision) => string
  nextSteps: { icon: string; label: string; href: string }[]
}> = {
  homeowner: {
    heroQuestion: 'How do I build an ADU?',
    perCapitaLabel: 'How active is your town?',
    provisionBottomLineLabel: 'What this means for your project',
    provisionBottomLine: (p) => {
      if (p.status === 'inconsistent') return 'This local rule is overridden by state law. You can proceed under the state standard.'
      if (p.status === 'review') return 'This provision is in a grey area. Ask your building department how they apply it.'
      return 'This provision matches state law. No issues expected.'
    },
    nextSteps: [
      { icon: 'Users', label: "Join your town's ADU Club for group builder rates", href: '/club' },
      { icon: 'Hammer', label: 'Find builders working in your county', href: '/builders' },
      { icon: 'BookOpen', label: 'Read the ADU homeowner guide', href: '/blog' },
    ],
  },
  builder: {
    heroQuestion: "Where's the market?",
    perCapitaLabel: 'Market activity',
    provisionBottomLineLabel: 'Market impact',
    provisionBottomLine: (p) => {
      if (p.status === 'inconsistent') return 'State law overrides this rule. Projects can proceed under state standards.'
      if (p.status === 'review') return 'Ambiguous standard may cause permitting delays. Build this into timelines.'
      return 'Aligned with state law. No regulatory friction on this provision.'
    },
    nextSteps: [
      { icon: 'Hammer', label: 'Join the builder network', href: '/builders' },
      { icon: 'BarChart3', label: 'See statewide demand data', href: '/rankings' },
      { icon: 'Users', label: 'Connect with ADU Club homeowners', href: '/club' },
    ],
  },
  lender: {
    heroQuestion: "What's the risk?",
    perCapitaLabel: 'Approval reliability',
    provisionBottomLineLabel: 'Risk factor',
    provisionBottomLine: (p) => {
      if (p.status === 'inconsistent') return 'Regulatory risk: local rule is inconsistent with state law but has not been formally challenged.'
      if (p.status === 'review') return 'Moderate risk: provision may be interpreted restrictively by local boards.'
      return 'Low risk: provision is consistent with state standards.'
    },
    nextSteps: [
      { icon: 'BookOpen', label: 'Read our Year One ADU analysis', href: '/blog' },
      { icon: 'BarChart3', label: 'Compare town-level approval data', href: '/rankings' },
      { icon: 'Scale', label: 'See statewide bylaw consistency data', href: '/compliance' },
    ],
  },
}
