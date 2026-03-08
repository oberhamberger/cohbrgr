import { DehydratedState } from '@tanstack/react-query';

export type State = {
    isProduction: boolean;
    nonce: string;
    contentHealthy?: boolean;
    dehydratedState?: DehydratedState;
};
