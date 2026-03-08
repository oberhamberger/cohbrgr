import { createContext, ReactNode } from 'react';

import { TranslationKey, TranslationKeys } from './types';

export type TranslationContextValue = {
    lang: string;
    keys: TranslationKeys;
    translate: (key: TranslationKey) => string;
};

const initialTranslationContext: TranslationContextValue = {
    lang: 'en',
    keys: {},
    translate: (key: TranslationKey) => key,
};

type ProviderProps = {
    children?: ReactNode;
    context?: {
        lang: string;
        keys: TranslationKeys;
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
    context = { lang: 'en', keys: {} },
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
            }}
        >
            {children}
        </TranslationContext.Provider>
    );
};
