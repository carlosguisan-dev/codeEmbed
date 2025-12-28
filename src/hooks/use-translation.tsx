'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import en from '@/locales/en.json';
import es from '@/locales/es.json';

const translations = { en, es };

type Locale = 'en' | 'es';

interface TranslationContextType {
  language: Locale;
  setLanguage: (language: Locale) => void;
  t: (key: keyof typeof en, options?: { [key: string]: string | number }) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Locale>('es');

  useEffect(() => {
    // We try to set the language from localStorage first.
    const storedLang = localStorage.getItem('language') as Locale;
    if (storedLang && (storedLang === 'en' || storedLang === 'es')) {
      setLanguage(storedLang);
    } else {
      // Otherwise, we check the browser language.
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'en') {
        setLanguage('en');
      }
    }
  }, []);

  const handleSetLanguage = (lang: Locale) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: keyof typeof en, options?: { [key: string]: string | number }) => {
    let text = translations[language][key] || translations['en'][key] || key;
    if (options) {
      Object.keys(options).forEach(optKey => {
        text = text.replace(`{{${optKey}}}`, String(options[optKey]));
      });
    }
    return text;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
