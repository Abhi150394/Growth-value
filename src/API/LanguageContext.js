import React, { createContext, useState, useContext, useEffect } from 'react';

const API_KEY = process.env.REACT_APP_GOOGLE_CLOUD_API_KEY;
const API_URL = 'https://translation.googleapis.com/language/translate/v2';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const [translations, setTranslations] = useState({});

    const translate = async (text, targetLanguage) => {
        if (translations[text]?.[targetLanguage]) {
            return translations[text][targetLanguage];
        }

        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    q: text,
                    target: targetLanguage,
                }),
            });

            const data = await response.json();
            const translatedText = data.data.translations[0].translatedText;

            setTranslations(prev => ({
                ...prev,
                [text]: { ...prev[text], [targetLanguage]: translatedText },
            }));

            return translatedText;
        } catch (error) {
            console.error('Translation error:', error);
            return text; // Fallback to original text
        }
    };

    const changeLanguage = (newLanguage) => {
        setLanguage(newLanguage);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, translate }}>
            {children}
        </LanguageContext.Provider>
    );
};