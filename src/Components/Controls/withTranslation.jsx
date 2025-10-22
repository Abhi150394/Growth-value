import React from 'react';
import { useLanguage } from '../../API/LanguageContext';

export const withTranslation = (WrappedComponent) => {
    return (props) => {
        const { language, translate } = useLanguage();

        const t = async (text) => {
            if (language === 'en') return text;
            return await translate(text, language);
        };

        return <WrappedComponent {...props} t={t} />;
    };
};