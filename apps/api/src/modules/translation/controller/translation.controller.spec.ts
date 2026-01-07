import type { Request, Response } from 'express';
import {
    fullTranslationController,
    languageSpecificTranslationController,
} from 'src/modules/translation/controller/translation.controller';
import { pickLanguage } from 'src/modules/translation/middleware/language.middleware';
import translationService from 'src/modules/translation/service/translation.service';
import { sendJsonWithEtag } from 'src/utils/middlewares';

jest.mock('src/modules/translation/middleware/language.middleware');
jest.mock('src/modules/translation/service/translation.service');
jest.mock('src/utils/middlewares');

describe('translation.controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            send: jest.fn(),
            set: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('fullTranslationController', () => {
        it('should send the full translation bundle', () => {
            const translations = { en: { a: 'b' }, de: { c: 'd' } };
            (translationService.get as jest.Mock).mockReturnValue(translations);

            fullTranslationController(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(sendJsonWithEtag).toHaveBeenCalledWith(
                mockResponse,
                translations,
            );
        });
    });

    describe('languageSpecificTranslationController', () => {
        it('should send language-specific translations', () => {
            const lang = 'de';
            const translations = { en: { a: 'b' }, de: { c: 'd' } };
            (pickLanguage as jest.Mock).mockReturnValue(lang);
            (translationService.get as jest.Mock).mockReturnValue(translations);

            languageSpecificTranslationController(
                mockRequest as Request,
                mockResponse as Response,
            );

            expect(pickLanguage).toHaveBeenCalledWith(mockRequest);
            expect(sendJsonWithEtag).toHaveBeenCalledWith(mockResponse, {
                lang,
                keys: translations[lang],
            });
        });
    });
});
