import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Massachusetts ADU Cost Estimator — Real Permit Data | ADU Pulse',
  description: 'Estimate ADU construction costs in your Massachusetts town. Based on real building permit data. Includes ROI calculator and local bylaw analysis.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
