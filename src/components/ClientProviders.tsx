'use client'

import { TownProvider } from '@/contexts/TownContext'
import { ReactNode } from 'react'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <TownProvider>
      {children}
    </TownProvider>
  )
}
