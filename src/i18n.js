import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ru from "./locales/ru.json";
import uz from "./locales/uz.json";

const resources = {
    uz: { translation: uz },
    ru: { translation: ru },
    en: { translation: en },
};

i18n.use(initReactI18next).init({
    resources,
    lng: "uz",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
