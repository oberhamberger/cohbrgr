import { TranslationKeys } from '@cohbrgr/localization';

export type State = {
    isProduction: boolean;
    nonce: string;
    translations: {
        lang: string;
        keys: TranslationKeys;
    };
};
