'use client'

import { clsx } from 'clsx'
import {
  User,
  Globe,
  Moon,
  Sun,
  Monitor,
  Bell,
  HelpCircle,
  Info,
  ChevronRight,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useThemeStore } from '@/store/themeStore'
import { locales } from '@/i18n/config'
import type { Theme, Language } from '@/types'

export default function ProfilePage() {
  const { theme, language, setTheme, setLanguage } = useThemeStore()

  const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="px-4 py-6">
          <div className="flex items-center gap-4">
            <div
              className={clsx(
                'w-16 h-16 rounded-full',
                'bg-primary-100 dark:bg-primary-900',
                'flex items-center justify-center'
              )}
            >
              <User className="w-8 h-8 text-primary-500" />
            </div>
            <div>
              <h1 className="text-h2 font-bold text-gray-900 dark:text-white">
                Guest User
              </h1>
              <p className="text-caption text-gray-500 dark:text-gray-400">
                Table 12
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Theme Settings */}
        <section>
          <h2 className="text-caption font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Appearance
          </h2>
          <Card padding="none">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-body text-gray-900 dark:text-white">
                  Theme
                </span>
              </div>
              <div className="flex gap-2">
                {themeOptions.map((option) => {
                  const Icon = option.icon
                  const isSelected = theme === option.value

                  return (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={clsx(
                        'flex-1 flex flex-col items-center gap-2 p-3 rounded-soft',
                        'transition-all duration-200',
                        isSelected
                          ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-small font-medium">
                        {option.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </Card>
        </section>

        {/* Language Settings */}
        <section>
          <h2 className="text-caption font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Language
          </h2>
          <Card padding="none">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {locales.slice(0, 5).map((locale) => (
                <button
                  key={locale.code}
                  onClick={() => setLanguage(locale.code as Language)}
                  className={clsx(
                    'w-full flex items-center justify-between px-4 py-3',
                    'text-left transition-colors duration-200',
                    'hover:bg-gray-50 dark:hover:bg-gray-800',
                    language === locale.code &&
                      'bg-primary-50 dark:bg-primary-900/20'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-body text-gray-900 dark:text-white">
                        {locale.nativeName}
                      </p>
                      <p className="text-small text-gray-500 dark:text-gray-400">
                        {locale.name}
                      </p>
                    </div>
                  </div>
                  {language === locale.code && (
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </Card>
        </section>

        {/* Other Settings */}
        <section>
          <h2 className="text-caption font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            More
          </h2>
          <Card padding="none">
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              <SettingsRow icon={Bell} label="Notifications" />
              <SettingsRow icon={HelpCircle} label="Help & Support" />
              <SettingsRow icon={Info} label="About" />
            </div>
          </Card>
        </section>

        {/* Version */}
        <p className="text-center text-small text-gray-400 dark:text-gray-500">
          MenuMichelle v0.1.0
        </p>
      </div>
    </div>
  )
}

function SettingsRow({
  icon: Icon,
  label,
}: {
  icon: typeof Bell
  label: string
}) {
  return (
    <button
      className={clsx(
        'w-full flex items-center justify-between px-4 py-3',
        'text-left transition-colors duration-200',
        'hover:bg-gray-50 dark:hover:bg-gray-800'
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-400" />
        <span className="text-body text-gray-900 dark:text-white">{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  )
}
