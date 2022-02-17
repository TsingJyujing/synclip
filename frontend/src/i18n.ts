import ZH from "./locales/zh.json";
import EN from "./locales/en.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const resources = {
    en: EN,
    zh: ZH
} as const;

i18n.use(initReactI18next).init({
    lng: 'zh',
    resources,
    interpolation: {
        escapeValue: false // react already safes from xss
    },
});

export default i18n;