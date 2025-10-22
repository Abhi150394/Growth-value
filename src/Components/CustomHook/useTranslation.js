import { useLanguage } from "../../API/LanguageContext";


export const useTranslation = () => {
    const { language, translate, changeLanguage } = useLanguage();

    const t = async (text) => {
        if (language === 'en') return text;
        return await translate(text, language);
    };

    return { t, language, changeLanguage };
};