import { createContext, ReactElement, useContext } from 'react';

export type SSRDataRegistry = {
    /**
     * Register a promise to be awaited before final SSR render.
     * The key is used to store and retrieve the resolved data.
     */
    registerPromise: (key: string, promise: Promise<unknown>) => void;
    /**
     * Get resolved data by key after promises have been awaited.
     */
    getData: <T>(key: string) => T | undefined;
    /**
     * Check if we're in the data collection phase (first pass).
     */
    isCollecting: boolean;
};

const defaultRegistry: SSRDataRegistry = {
    registerPromise: () => {},
    getData: () => undefined,
    isCollecting: false,
};

export const SSRDataContext = createContext<SSRDataRegistry>(defaultRegistry);

type SSRDataProviderProps = {
    children: ReactElement;
    registry: SSRDataRegistry;
};

/**
 * Provider for SSR data registry. Used by the render middleware to enable
 * two-pass SSR where components can register data requirements.
 */
export const SSRDataProvider = ({
    children,
    registry,
}: SSRDataProviderProps) => {
    return (
        <SSRDataContext.Provider value={registry}>
            {children}
        </SSRDataContext.Provider>
    );
};

/**
 * Hook to access the SSR data registry.
 */
export const useSSRData = () => useContext(SSRDataContext);

/**
 * Creates an SSR data registry for use in the render middleware.
 * Call createRegistry() for first pass, then getResolvedRegistry() for second pass.
 */
export const createSSRDataRegistry = () => {
    const promises = new Map<string, Promise<unknown>>();
    const resolvedData = new Map<string, unknown>();

    const collectingRegistry: SSRDataRegistry = {
        registerPromise: (key, promise) => {
            if (!promises.has(key)) {
                promises.set(key, promise);
            }
        },
        getData: () => undefined,
        isCollecting: true,
    };

    const resolvedRegistry: SSRDataRegistry = {
        registerPromise: () => {},
        getData: <T,>(key: string) => resolvedData.get(key) as T | undefined,
        isCollecting: false,
    };

    const awaitPromises = async (): Promise<void> => {
        const entries = Array.from(promises.entries());
        const results = await Promise.all(
            entries.map(async ([key, promise]) => {
                try {
                    const data = await promise;
                    return { key, data };
                } catch {
                    return { key, data: undefined };
                }
            }),
        );
        results.forEach(({ key, data }) => {
            resolvedData.set(key, data);
        });
    };

    return {
        collectingRegistry,
        resolvedRegistry,
        awaitPromises,
        hasPromises: () => promises.size > 0,
    };
};
