import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import en from '../locales/en.json'
import hi from '../locales/hi.json'

export const LANGUAGE_STORAGE_KEY = 'agropulse_language'

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'mr', name: 'Marathi' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'kn', name: 'Kannada' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'bn', name: 'Bengali' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'or', name: 'Odia' },
]

const dictionaries = { en, hi }
const LanguageContext = createContext(null)

export function normalizeLanguage(value) {
  if (!value) return 'en'
  const raw = String(value).trim()
  const lower = raw.toLowerCase()
  return LANGUAGES.find((lang) => lang.code === lower || lang.name.toLowerCase() === lower)?.code || 'en'
}

export function getLanguageName(value) {
  const code = normalizeLanguage(value)
  return LANGUAGES.find((lang) => lang.code === code)?.name || 'English'
}

function readInitialLanguage() {
  const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (storedLanguage) return normalizeLanguage(storedLanguage)

  const storedUser = localStorage.getItem('agropulse_user')
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser)
      return normalizeLanguage(user.preferredLanguage)
    } catch {}
  }

  return 'en'
}

function readPath(source, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), source)
}

function interpolate(value, params) {
  if (typeof value !== 'string' || !params) return value
  return value.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] ?? '')
}

async function syncLanguagePreference(languageName) {
  const token = localStorage.getItem('agropulse_token')
  if (!token) return

  await fetch('/api/profile/preferences', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ preferredLanguage: languageName }),
  })
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(readInitialLanguage)

  const setLanguage = useCallback((nextLanguage, options = {}) => {
    const code = normalizeLanguage(nextLanguage)
    const languageName = getLanguageName(code)
    setLanguageState(code)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code)

    const storedUser = localStorage.getItem('agropulse_user')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        localStorage.setItem('agropulse_user', JSON.stringify({ ...user, preferredLanguage: languageName }))
      } catch {}
    }

    if (options.sync !== false) {
      syncLanguagePreference(languageName).catch((err) => {
        console.warn('[Language] Unable to sync preferred language:', err)
      })
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const t = useCallback((key, params) => {
    const dictionary = dictionaries[language] || en
    const translated = readPath(dictionary, key)
    const fallback = readPath(en, key)
    return interpolate(translated ?? fallback ?? key, params)
  }, [language])

  const value = useMemo(() => ({
    language,
    languageName: getLanguageName(language),
    languages: LANGUAGES,
    setLanguage,
    t,
  }), [language, setLanguage, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageContext

