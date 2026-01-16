'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { Search, X } from 'lucide-react'
import { useMenuStore } from '@/store/menuStore'

interface SearchBarProps {
  placeholder?: string
  className?: string
}

export function SearchBar({ placeholder = 'Search...', className }: SearchBarProps) {
  const { searchQuery, setSearchQuery } = useMenuStore()
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div
      className={clsx(
        'relative flex items-center',
        'transition-all duration-200',
        className
      )}
    >
      <div
        className={clsx(
          'flex items-center w-full gap-3 px-4 py-3',
          'bg-gray-100 dark:bg-gray-800',
          'rounded-soft',
          'transition-all duration-200',
          isFocused && 'ring-2 ring-primary-500 bg-white dark:bg-gray-900'
        )}
      >
        <Search
          className={clsx(
            'w-5 h-5 flex-shrink-0',
            'transition-colors duration-200',
            isFocused ? 'text-primary-500' : 'text-gray-400'
          )}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={clsx(
            'flex-1 bg-transparent outline-none',
            'text-gray-900 dark:text-white',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500'
          )}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className={clsx(
              'p-1 rounded-full',
              'text-gray-400 hover:text-gray-600',
              'dark:hover:text-gray-300',
              'transition-colors duration-200'
            )}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
