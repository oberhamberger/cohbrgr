import { createContext, ReactElement } from 'react';

import { State } from 'src/client/store/state';
import { defaultTranslations } from 'src/client/contexts/translation';

const initialAppStateContext: State = {
    isProduction: false,
    nonce: '',
    translations: {
        lang: 'en',
        keys: defaultTranslations,
    },
};

type ProviderProps = {
    children?: ReactElement;
    context: State;
};

export const AppStateContext = createContext<State>(initialAppStateContext);

export const AppStateProvider = ({
    children,
    context = initialAppStateContext,
}: ProviderProps) => {
    return (
        <AppStateContext.Provider value={context}>
            {children}
        </AppStateContext.Provider>
    );
};
