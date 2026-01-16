'use client'

import { clsx } from 'clsx'
import { MapPin, Clock, Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

export function Header() {
  const { theme, setTheme, getEffectiveTheme } = useThemeStore()
  const effectiveTheme = getEffectiveTheme()

  const toggleTheme = () => {
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
      <div className="px-4 py-4">
        {/* Restaurant Info */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-h1 font-bold text-gray-900 dark:text-white">
              Michelle's Kitchen
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-caption text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Table 12
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Open until 10 PM
              </span>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={clsx(
              'p-2 rounded-full',
              'bg-gray-100 dark:bg-gray-800',
              'text-gray-600 dark:text-gray-400',
              'hover:bg-gray-200 dark:hover:bg-gray-700',
              'transition-colors duration-200'
            )}
            aria-label="Toggle theme"
          >
            {effectiveTheme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Welcome Message - Time-based personalization */}
        <div className="mt-4 p-3 rounded-soft bg-primary-50 dark:bg-primary-900/20">
          <p className="text-caption text-primary-700 dark:text-primary-300">
            <TimeBasedGreeting /> Browse our menu and order when you're ready.
          </p>
        </div>
      </div>
    </header>
  )
}

function TimeBasedGreeting() {
  const hour = new Date().getHours()

  if (hour < 12) return <>Good morning!</>
  if (hour < 17) return <>Good afternoon!</>
  return <>Good evening!</>
}
