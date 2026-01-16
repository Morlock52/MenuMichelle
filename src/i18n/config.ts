import type { LocaleConfig, Language } from '@/types'

export const locales: LocaleConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', rtl: true },
]

export const defaultLocale: Language = 'en'

export function getLocaleConfig(code: Language): LocaleConfig | undefined {
  return locales.find((locale) => locale.code === code)
}

export function isRTL(code: Language): boolean {
  const config = getLocaleConfig(code)
  return config?.rtl ?? false
}
