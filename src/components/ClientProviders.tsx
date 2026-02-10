'use client'

import { TownProvider } from '@/contexts/TownContext'
import BottomNav from '@/components/BottomNav'
import { ReactNode } from 'react'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <TownProvider>
      <div className="pb-16 md:pb-0">
        {children}
      </div>
      <BottomNav />
    </TownProvider>
  )
}
