import { useLanguage } from "../../API/LanguageContext";


export const useTranslation = () => {
    const { language, translate,translations, changeLanguage } = useLanguage();

    const t = async (text) => {
        if (language === 'en') return text;
        return await translate(text, language);
    };

    const tSync = (text) => {
        if (language === "en") return text;
        return translations?.[text]?.[language] || text;
    };

    return { t, tSync, language, changeLanguage };
};