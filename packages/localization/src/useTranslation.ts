import { useContext } from 'react';

import { TranslationContext, TranslationContextValue } from './context';

/**
 * Hook to access translation context values.
 * Returns the current language, translation keys, and a translation function.
 */
export const useTranslation = (): TranslationContextValue => {
    return useContext(TranslationContext);
};
