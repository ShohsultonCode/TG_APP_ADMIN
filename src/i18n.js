// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationUZ from './locales/uz/translation.json';
import translationRU from './locales/ru/translation.json';

const resources = {
    uz: {
        translation: translationUZ
    },
    ru: {
        translation: translationRU
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'uz', // default language
        fallbackLng: 'uz',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
