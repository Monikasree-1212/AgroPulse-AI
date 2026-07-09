import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useCallback } from 'react';
import api from '../services/api';

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ml', name: 'Malayalam' }
];

export function normalizeLanguage(value) {
  if (!value) return 'en';
  const raw = String(value).trim().toLowerCase();
  return LANGUAGES.find((lang) => lang.code === raw || lang.name.toLowerCase() === raw)?.code || 'en';
}

export function getLanguageName(value) {
  const code = normalizeLanguage(value);
  return LANGUAGES.find((lang) => lang.code === code)?.name || 'English';
}

export default function useTranslation() {
  const { t, i18n } = useI18nTranslation();
  const language = i18n.language || 'en';
  
  const setLanguage = useCallback((nextLanguage, options = {}) => {
    const code = normalizeLanguage(nextLanguage);
    const languageName = getLanguageName(code);
    
    i18n.changeLanguage(code);
    localStorage.setItem('agropulse_language', code);
    document.documentElement.lang = code;

    const storedUser = localStorage.getItem('agropulse_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        localStorage.setItem('agropulse_user', JSON.stringify({ ...user, preferredLanguage: languageName }));
      } catch {}
    }

    if (options.sync !== false) {
      const token = localStorage.getItem('agropulse_token');
      if (token) {
        api.put('/api/profile/preferences',
          { preferredLanguage: languageName },
          { headers: { Authorization: `Bearer ${token}` } }
        ).catch((err) => {
          console.warn('[Language] Unable to sync preferred language:', err);
        });
      }
    }
  }, [i18n]);

  return { t, language, setLanguage, languages: LANGUAGES };
}
