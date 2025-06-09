
// This file initializes and configures the i18next library for internationalization (i18n).
// It sets up language resources, default language, fallback language, and React integration.

import i18n from 'i18next'; 
// Import the core i18next library for internationalization features

import { initReactI18next } from 'react-i18next'; 
// Import the React bindings for i18next to integrate i18n with React apps

import translationEN from './locales/en/translation.json'; 
// Import English translation JSON file

import translationAR from './locales/ar/translation.json'; 
// Import Arabic translation JSON file

i18n
  .use(initReactI18next) 
  // Pass i18next instance to React integration so hooks/components can use i18n

  .init({
    resources: {
      // Define translation resources for each supported language
      en: { translation: translationEN },
      ar: { translation: translationAR }
    },
    lng: 'en', 
    // Set the initial/default language to English

    fallbackLng: 'en', 
    // If the current language translations are missing keys, fallback to English

    interpolation: {
      escapeValue: false  
      // Disable escaping values, React already protects against XSS
    }
  });

export default i18n;
// Export the configured i18next instance for use throughout the React app

