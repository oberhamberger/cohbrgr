import TranslationData from 'data/translations.json';

import { Logger } from '@cohbrgr/utils';

/**
 * TranslationService
 */
class TranslationService {
    readonly translations: typeof TranslationData;
    constructor() {
        this.translations = TranslationData;
    }

    /**
     * Returns values from Translation Service
     *
     * @param key
     */
    get(): typeof TranslationData {
        Logger.debug(`[Translation SERVICE] get()`);
        return this.translations;
    }
}

export default new TranslationService();
