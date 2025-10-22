import React, { useState, useEffect } from 'react';
import { useTranslation } from '../CustomHook/useTranslation';

const TranslatedText = ({ children }) => {
    const { t, language } = useTranslation();
    const [translatedText, setTranslatedText] = useState(children);

    useEffect(() => {
        const translateText = async () => {
            if (typeof children === 'string') {
                const text = await t(children);
                setTranslatedText(text);
            }
        };
        translateText();
    }, [t, language, children]);

    return <>{translatedText}</>;
};

export default TranslatedText;