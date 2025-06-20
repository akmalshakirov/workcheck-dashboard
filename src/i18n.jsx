import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import translationEN from "/public/locales/en.json";
import translationUZ from "/public/locales/uz.json";
import translationRU from "/public/locales/ru.json";

const resources = {
    en: { translation: translationEN },
    uz: { translation: translationUZ },
    uz: { translation: translationRU },
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "uz",
        lng: "uz",
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ["querystring", "cookie", "localStorage", "navigator"],
            caches: ["cookie", "localStorage"],
        },
    });

export default i18n;
