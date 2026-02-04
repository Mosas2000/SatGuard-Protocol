/**
 * Multi-Language Support (i18n)
 * Internationalization system for the application
 */

import { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja';

interface Translations {
    [key: string]: {
        [lang in Language]: string;
    };
}

const translations: Translations = {
    // Common
    'common.welcome': {
        en: 'Welcome',
        es: 'Bienvenido',
        fr: 'Bienvenue',
        de: 'Willkommen',
        zh: '欢迎',
        ja: 'ようこそ'
    },
    'common.dashboard': {
        en: 'Dashboard',
        es: 'Panel',
        fr: 'Tableau de bord',
        de: 'Dashboard',
        zh: '仪表板',
        ja: 'ダッシュボード'
    },
    'common.pools': {
        en: 'Pools',
        es: 'Fondos',
        fr: 'Pools',
        de: 'Pools',
        zh: '资金池',
        ja: 'プール'
    },
    'common.claims': {
        en: 'Claims',
        es: 'Reclamaciones',
        fr: 'Réclamations',
        de: 'Ansprüche',
        zh: '索赔',
        ja: '請求'
    },
    'common.governance': {
        en: 'Governance',
        es: 'Gobernanza',
        fr: 'Gouvernance',
        de: 'Governance',
        zh: '治理',
        ja: 'ガバナンス'
    },
    // Actions
    'action.contribute': {
        en: 'Contribute',
        es: 'Contribuir',
        fr: 'Contribuer',
        de: 'Beitragen',
        zh: '贡献',
        ja: '貢献する'
    },
    'action.submit_claim': {
        en: 'Submit Claim',
        es: 'Enviar Reclamación',
        fr: 'Soumettre une réclamation',
        de: 'Anspruch einreichen',
        zh: '提交索赔',
        ja: '請求を提出'
    },
    'action.vote': {
        en: 'Vote',
        es: 'Votar',
        fr: 'Voter',
        de: 'Abstimmen',
        zh: '投票',
        ja: '投票する'
    }
};

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>(() => {
        const saved = localStorage.getItem('language');
        return (saved as Language) || 'en';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: string): string => {
        return translations[key]?.[language] || key;
    };

    return (
        <I18nContext.Provider value= {{ language, setLanguage, t }
}>
    { children }
    </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useI18n must be used within I18nProvider');
    }
    return context;
}

export function LanguageSelector() {
    const { language, setLanguage } = useI18n();

    const languages: { code: Language; name: string; flag: string }[] = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
        { code: 'zh', name: '中文', flag: '🇨🇳' },
        { code: 'ja', name: '日本語', flag: '🇯🇵' }
    ];

    return (
        <select
            value= { language }
    onChange = {(e) => setLanguage(e.target.value as Language)
}
className = "px-3 py-2 rounded-lg border border-gray-300 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
{
    languages.map(lang => (
        <option key= { lang.code } value = { lang.code } >
        { lang.flag } { lang.name }
    </option>
    ))
}
    </select>
    );
}
