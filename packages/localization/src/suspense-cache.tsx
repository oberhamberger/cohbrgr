import { createContext, ReactElement, useContext } from 'react';

import { TranslationProvider } from './context';
import { TranslationResponse } from './types';

type CacheEntry<T> =
    | { status: 'pending'; promise: Promise<T> }
    | { status: 'resolved'; data: T }
    | { status: 'rejected'; error: unknown };

export type TranslationCache = {
    /**
     * Read translations from cache. Suspends if not yet resolved.
     */
    read: () => TranslationResponse;
    /**
     * Get resolved data (non-suspending). Returns undefined if not resolved.
     * Used for SSR data injection after render completes.
     */
    getResolved: () => TranslationResponse | undefined;
};

/**
 * Creates a Suspense-compatible translation cache.
 * The cache suspends on first read until the promise resolves.
 */
export const createTranslationCache = (
    fetcher: () => Promise<TranslationResponse>,
): TranslationCache => {
    let entry: CacheEntry<TranslationResponse> | undefined;

    const read = (): TranslationResponse => {
        if (!entry) {
            const promise = fetcher()
                .then((data) => {
                    entry = { status: 'resolved', data };
                    return data;
                })
                .catch((error) => {
                    entry = { status: 'rejected', error };
                    throw error;
                });
            entry = { status: 'pending', promise };
        }

        if (entry.status === 'pending') {
            // This throws the promise, causing React to suspend
            throw entry.promise;
        }

        if (entry.status === 'rejected') {
            throw entry.error;
        }

        return entry.data;
    };

    const getResolved = (): TranslationResponse | undefined => {
        if (entry?.status === 'resolved') {
            return entry.data;
        }
        return undefined;
    };

    return { read, getResolved };
};

// Context for passing the translation cache through the component tree
const TranslationCacheContext = createContext<TranslationCache | null>(null);

type TranslationCacheProviderProps = {
    children: ReactElement;
    cache: TranslationCache;
};

/**
 * Provider for the translation cache. Used by the render middleware.
 */
export const TranslationCacheProvider = ({
    children,
    cache,
}: TranslationCacheProviderProps) => {
    return (
        <TranslationCacheContext.Provider value={cache}>
            {children}
        </TranslationCacheContext.Provider>
    );
};

/**
 * Hook to access the translation cache.
 */
export const useTranslationCache = (): TranslationCache | null => {
    return useContext(TranslationCacheContext);
};

type SuspenseTranslationLoaderProps = {
    children: ReactElement;
    /**
     * Fallback language code if translations fail to load.
     */
    fallbackLang?: string;
};

/**
 * Inner component that reads from cache (may suspend).
 */
const TranslationReader = ({
    children,
    fallbackLang = 'en',
}: SuspenseTranslationLoaderProps) => {
    const cache = useTranslationCache();

    if (!cache) {
        // No cache provided - use empty translations (client-side without SSR)
        return (
            <TranslationProvider
                context={{ lang: fallbackLang, keys: {}, isDefault: true }}
            >
                {children}
            </TranslationProvider>
        );
    }

    // This will suspend if translations aren't ready
    const translations = cache.read();

    return (
        <TranslationProvider
            context={{
                lang: translations.lang,
                keys: translations.keys,
                isDefault: false,
            }}
        >
            {children}
        </TranslationProvider>
    );
};

TranslationReader.displayName = 'TranslationReader';

/**
 * Component that loads translations using Suspense.
 * Must be wrapped in a <Suspense> boundary.
 */
export const SuspenseTranslationLoader = ({
    children,
    fallbackLang = 'en',
}: SuspenseTranslationLoaderProps) => {
    return (
        <TranslationReader fallbackLang={fallbackLang}>
            {children}
        </TranslationReader>
    );
};

SuspenseTranslationLoader.displayName = 'SuspenseTranslationLoader';
