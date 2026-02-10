'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface TownContextType {
  selectedTown: string | null
  setSelectedTown: (town: string) => void
  intent: string | null
  setIntent: (intent: string) => void
  clearTown: () => void
}

const TownContext = createContext<TownContextType>({
  selectedTown: null,
  setSelectedTown: () => {},
  intent: null,
  setIntent: () => {},
  clearTown: () => {},
})

export function TownProvider({ children }: { children: ReactNode }) {
  const [selectedTown, setSelectedTownState] = useState<string | null>(null)
  const [intent, setIntentState] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('adupulse_town')
    const savedIntent = localStorage.getItem('adupulse_intent')
    if (saved) setSelectedTownState(saved)
    if (savedIntent) setIntentState(savedIntent)
    setHydrated(true)
  }, [])

  const setSelectedTown = (town: string) => {
    setSelectedTownState(town)
    localStorage.setItem('adupulse_town', town)
  }

  const setIntent = (i: string) => {
    setIntentState(i)
    localStorage.setItem('adupulse_intent', i)
  }

  const clearTown = () => {
    setSelectedTownState(null)
    setIntentState(null)
    localStorage.removeItem('adupulse_town')
    localStorage.removeItem('adupulse_intent')
  }

  if (!hydrated) return <>{children}</>

  return (
    <TownContext.Provider value={{ selectedTown, setSelectedTown, intent, setIntent, clearTown }}>
      {children}
    </TownContext.Provider>
  )
}

export const useTown = () => useContext(TownContext)
