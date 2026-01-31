import { createContext, ReactElement } from 'react';

import { TranslationKey, TranslationKeys } from './types';

export type TranslationContextValue = {
    lang: string;
    keys: TranslationKeys;
    translate: (key: TranslationKey) => string;
    isDefault: boolean;
};

const initialTranslationContext: TranslationContextValue = {
    lang: 'en',
    keys: {},
    translate: (key: TranslationKey) => key,
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
    context = { lang: 'en', keys: {}, isDefault: true },
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
