import { FunctionComponent, ReactElement, useEffect, useState } from 'react';

import { TranslationProvider } from './context';
import { useSSRData } from './ssr-context';
import { TranslationKeys, TranslationResponse } from './types';

const SSR_DATA_KEY = 'translations';

interface ITranslationLoader {
    children: ReactElement;
    /**
     * Function to fetch translations. Called during SSR and client-side.
     */
    fetchTranslations: () => Promise<TranslationResponse>;
    /**
     * Language code for the translations.
     */
    lang?: string;
}

export type TranslationLoaderProps = ITranslationLoader;

type TranslationState = {
    lang: string;
    keys: TranslationKeys;
    isDefault: boolean;
};

/**
 * Component that handles translation loading for both SSR and client-side.
 *
 * During SSR (first pass): Registers a translation fetch promise with the SSR data registry.
 * During SSR (second pass): Uses resolved translations from the registry.
 * During client-side: Uses SSR translations initially, no additional fetch needed.
 */
const TranslationLoader: FunctionComponent<ITranslationLoader> = ({
    children,
    fetchTranslations,
    lang = 'en',
}) => {
    const ssrData = useSSRData();

    // During SSR first pass, register the translation fetch promise
    if (ssrData.isCollecting) {
        ssrData.registerPromise(SSR_DATA_KEY, fetchTranslations());
    }

    // Get resolved translations from SSR data registry (second pass or client hydration)
    const ssrTranslations = ssrData.getData<TranslationResponse>(SSR_DATA_KEY);

    const [translations, setTranslations] = useState<TranslationState>(() => ({
        lang: ssrTranslations?.lang ?? lang,
        keys: ssrTranslations?.keys ?? {},
        isDefault: !ssrTranslations,
    }));

    // Client-side: fetch translations if not available from SSR
    useEffect(() => {
        // Skip if we already have translations from SSR
        if (ssrTranslations) {
            return;
        }

        // Only fetch on client-side if needed
        if (translations.isDefault) {
            fetchTranslations()
                .then((data) => {
                    setTranslations({
                        lang: data.lang,
                        keys: data.keys,
                        isDefault: false,
                    });
                })
                .catch(() => {
                    // Keep showing keys in brackets on error
                });
        }
    }, [fetchTranslations, ssrTranslations, translations.isDefault]);

    return (
        <TranslationProvider context={translations}>
            {children}
        </TranslationProvider>
    );
};

TranslationLoader.displayName = 'TranslationLoader';

export default TranslationLoader;
