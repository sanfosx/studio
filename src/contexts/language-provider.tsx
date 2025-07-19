'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import en from '@/lib/locales/en.json';
import es from '@/lib/locales/es.json';

type Language = 'en' | 'es';
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Translations;
  t: (key: keyof Translations) => string;
}

const translations = { en, es };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es');

  useEffect(() => {
    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang && ['en', 'es'].includes(storedLang)) {
      setLanguage(storedLang);
    } else {
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'es') {
            setLanguage('es');
        } else {
            setLanguage('en');
        }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: keyof Translations): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, translations: translations[language], t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
