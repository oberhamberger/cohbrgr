import { State } from 'src/client/store/state';

import { ReactElement, createContext } from 'react';

const initialAppStateContext: State = {
    isProduction: false,
    nonce: '',
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
