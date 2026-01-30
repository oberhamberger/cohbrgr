import { TranslationKeys } from 'src/client/types/translation';

export type State = {
    isProduction: boolean;
    nonce: string;
    translations: {
        lang: string;
        keys: TranslationKeys;
    };
};
