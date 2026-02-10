'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTown } from '@/contexts/TownContext'

const navItems = [
  { label: 'Home', href: '/', icon: '🏠' },
  { label: 'My Town', href: '/my-town', icon: '📍' },
  { label: 'Estimate', href: '/estimate', icon: '💰' },
  { label: 'Next Steps', href: '/next-steps', icon: '→' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const { selectedTown } = useTown()

  // Resolve "My Town" to actual town page if one is selected
  const resolvedItems = navItems.map(item => {
    if (item.href === '/my-town' && selectedTown) {
      const slug = selectedTown.toLowerCase().replace(/\s+/g, '-')
      return { ...item, href: `/towns/${slug}`, label: selectedTown }
    }
    return item
  })

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 z-[100]">
      <div className="flex justify-around items-center h-16 px-1">
        {resolvedItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[48px] rounded-lg px-2 py-1 transition-colors ${
                isActive
                  ? 'text-blue-400'
                  : 'text-gray-500 hover:text-gray-300 active:text-gray-200'
              }`}
            >
              <span className="text-lg mb-0.5">{item.icon}</span>
              <span className="text-[10px] font-medium truncate max-w-[72px]">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
