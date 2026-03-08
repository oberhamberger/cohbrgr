import { pickLanguage } from 'src/modules/translation/middleware/language.middleware';
import translationService from 'src/modules/translation/service/translation.service';

import { sendJsonWithEtag } from '@cohbrgr/server';

import type { Request, Response } from 'express';

/**
 * Controller that returns the complete translation bundle for all languages with ETag caching.
 */
export const fullTranslationController = (
    _request: Request,
    response: Response,
) => {
    return sendJsonWithEtag(response, translationService.get());
};

/**
 * Controller that returns translations for a specific language determined from the request with ETag caching.
 */
export const languageSpecificTranslationController = (
    _request: Request,
    response: Response,
) => {
    const selectedLanguage = pickLanguage(_request);
    const selectedKeys = translationService.get()[selectedLanguage];

    return sendJsonWithEtag(response, {
        lang: selectedLanguage,
        keys: selectedKeys,
    });
};
