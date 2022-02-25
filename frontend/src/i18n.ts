import ZH from "./locales/zh.json";
import EN from "./locales/en.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const resources = {
    en: EN,
    zh: ZH
} as const;

function getBrowserLocales(options = {}) {
    const defaultOptions = {
        languageCodeOnly: false,
    };
    const opt = {
        ...defaultOptions,
        ...options,
    };
    const browserLocales =
        navigator.languages === undefined
            ? [navigator.language]
            : navigator.languages;

    if (!browserLocales) {
        return [];
    }
    return browserLocales.map(locale => {
        const trimmedLocale = locale.trim();
        return opt.languageCodeOnly
            ? trimmedLocale.split(/-|_/)[0]
            : trimmedLocale;
    });
}

i18n.use(initReactI18next).init({
    lng: (
        () => {
            const currentLocalLanguage = getBrowserLocales({ languageCodeOnly: true });
            const useableLanguage = currentLocalLanguage.filter(lng => lng in resources);
            console.log(`Select ${useableLanguage} from ${currentLocalLanguage}`);
            if (useableLanguage.length > 0) {
                return useableLanguage[0]
            } else {
                return "en"
            }
        }
    )(),
    fallbackLng: "en",
    resources,
    interpolation: {
        escapeValue: false // react already safes from xss
    },
});

export default i18n;