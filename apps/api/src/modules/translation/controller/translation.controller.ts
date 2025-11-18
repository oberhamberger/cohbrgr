import type { Request, Response } from 'express';
import { pickLanguage } from 'src/modules/translation/middleware/language.middleware';
import translationService from 'src/modules/translation/service/translation.service';
import { sendJsonWithEtag } from 'src/utils/middlewares';

// Full translation bundle
export const fullTranslationController = (
    _request: Request,
    response: Response,
) => {
    sendJsonWithEtag(response, translationService.get());
};

// Language-specific via path param: /translations/de
export const languageSpecificTranslationController = (
    request: Request,
    response: Response,
) => {
    const selectedLanguage = pickLanguage(request);
    const selectedKeys = translationService.get()[selectedLanguage];

    sendJsonWithEtag(response, {
        lang: selectedLanguage,
        keys: selectedKeys,
    });
};
