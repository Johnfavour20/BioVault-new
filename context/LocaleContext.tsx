import React, { createContext, useState, useEffect, ReactNode, useCallback, useContext } from 'react';

const availableLanguages = ['en', 'es', 'fr'];
export type Language = 'en' | 'es' | 'fr';

type Translations = { [key: string]: string | any };

interface LocaleContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
};

interface LocaleProviderProps {
  children: ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const storedLang = localStorage.getItem('biovault-lang');
    if (storedLang && availableLanguages.includes(storedLang)) {
      return storedLang as Language;
    }
    return 'en';
  });
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    fetch(`/locales/${language}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Could not fetch locale file: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setTranslations(data);
      })
      .catch(error => console.error('Failed to load translations:', error));
  }, [language]);

  const setLanguage = (lang: Language) => {
    localStorage.setItem('biovault-lang', lang);
    setLanguageState(lang);
  };

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
    const keys = key.split('.');
    let value: string | Translations = translations;
    for (const k of keys) {
      if (typeof value === 'object' && value && k in value) {
        value = value[k];
      } else {
        return key; 
      }
    }
    
    if (typeof value === 'string' && replacements) {
        return Object.entries(replacements).reduce((acc, [placeholder, replacement]) => {
            return acc.replace(`{${placeholder}}`, String(replacement));
        }, value);
    }

    return typeof value === 'string' ? value : key;
  }, [translations]);

  const value = {
    language,
    setLanguage,
    t,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};
