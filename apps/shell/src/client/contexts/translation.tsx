import { createContext, ReactElement } from 'react';

import { TranslationKey, TranslationKeys } from 'src/client/types/translation';

/**
 * Default English translations as fallback.
 */
export const defaultTranslations: TranslationKeys = {
    'hero.subtitle': 'c.f.k.o',
    'hero.title': 'My Name is Christian.',
    'hero.text':
        "I am a Frontend Architect at <a href='https://netconomy.net'>Netconomy</a>. I mainly work with React and Node.js on online commerce platforms.",
    'hero.nav.github': 'Github',
    'hero.nav.bluesky': 'Bluesky',
    'hero.nav.linkedin': 'LinkedIn',
    'offline.nav.refresh': 'return',
    'offline.nav.back': 'zurück',
};

export type TranslationContextValue = {
    lang: string;
    keys: TranslationKeys;
    translate: (key: TranslationKey) => string;
    isDefault: boolean;
};

const initialTranslationContext: TranslationContextValue = {
    lang: 'en',
    keys: defaultTranslations,
    translate: (key: TranslationKey) => defaultTranslations[key] ?? key,
    isDefault: true,
};

type ProviderProps = {
    children?: ReactElement;
    context?: {
        lang: string;
        keys: TranslationKeys;
        isDefault?: boolean;
    };
};

export const TranslationContext = createContext<TranslationContextValue>(
    initialTranslationContext,
);

/**
 * Provider component that makes translations available to the component tree.
 */
export const TranslationProvider = ({
    children,
    context = { lang: 'en', keys: defaultTranslations, isDefault: true },
}: ProviderProps) => {
    const translate = (key: TranslationKey): string => {
        return context.keys[key] ?? key;
    };

    return (
        <TranslationContext.Provider
            value={{
                lang: context.lang,
                keys: context.keys,
                translate,
                isDefault: context.isDefault ?? true,
            }}
        >
            {children}
        </TranslationContext.Provider>
    );
};
