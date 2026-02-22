'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface TownSearchProps {
  towns: string[]
  value: string
  onSelect: (town: string) => void
  placeholder?: string
}

export default function TownSearch({ towns, value, onSelect, placeholder = 'Type your town...' }: TownSearchProps) {
  const [query, setQuery] = useState(value)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = query
    ? towns.filter(t => t.toLowerCase().startsWith(query.toLowerCase())).slice(0, 8)
    : []

  // Sync external value changes
  useEffect(() => { setQuery(value) }, [value])

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement | undefined
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [activeIndex])

  const select = useCallback((town: string) => {
    setQuery(town)
    setIsOpen(false)
    setActiveIndex(-1)
    onSelect(town)
  }, [onSelect])

  const clear = () => {
    setQuery('')
    setIsOpen(false)
    setActiveIndex(-1)
    onSelect('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filtered.length === 0) {
      if (e.key === 'ArrowDown' && filtered.length > 0) {
        setIsOpen(true)
        setActiveIndex(0)
        e.preventDefault()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(i => (i + 1) % filtered.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(i => (i - 1 + filtered.length) % filtered.length)
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0 && activeIndex < filtered.length) {
          select(filtered[activeIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setActiveIndex(-1)
        break
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={e => {
            setQuery(e.target.value)
            setIsOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => { if (query) setIsOpen(true) }}
          onKeyDown={handleKeyDown}
          className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none min-h-[48px] pr-8"
        />
        {query && (
          <button
            type="button"
            onClick={clear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1"
            aria-label="Clear"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {isOpen && filtered.length > 0 && (
        <div
          ref={listRef}
          className="absolute left-0 right-0 mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-50 overflow-y-auto max-h-[352px]"
        >
          {filtered.map((town, i) => (
            <button
              key={town}
              type="button"
              onClick={() => select(town)}
              className={`w-full text-left px-3 py-3 text-sm min-h-[44px] transition-colors ${
                i === activeIndex
                  ? 'bg-emerald-600/30 text-emerald-300'
                  : 'text-gray-200 hover:bg-gray-600/50'
              } ${i === 0 ? 'rounded-t-lg' : ''} ${i === filtered.length - 1 ? 'rounded-b-lg' : ''}`}
            >
              {town}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
