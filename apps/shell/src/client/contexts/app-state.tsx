import { createContext, ReactElement } from 'react';

import { defaultTranslations } from '@cohbrgr/localization';
import { State } from 'src/client/store/state';

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
