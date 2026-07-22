import type { Mock } from 'vitest';

import {
    fullTranslationController,
    languageSpecificTranslationController,
} from 'src/modules/translation/controller/translation.controller';
import { pickLanguage } from 'src/modules/translation/middleware/language.middleware';
import translationService from 'src/modules/translation/service/translation.service';

import { sendJsonWithEtag } from '@cohbrgr/server';

import type { Request, Response } from 'express';

vi.mock('src/modules/translation/middleware/language.middleware');
vi.mock('src/modules/translation/service/translation.service');
vi.mock('@cohbrgr/server', async () => ({
    ...(await vi.importActual('@cohbrgr/server')),
    sendJsonWithEtag: vi.fn(),
}));

describe('translation.controller', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            send: vi.fn(),
            set: vi.fn(),
            status: vi.fn().mockReturnThis(),
        };
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('fullTranslationController', () => {
        it('should send the full translation bundle', () => {
            const translations = { en: { a: 'b' }, de: { c: 'd' } };
            (translationService.get as Mock).mockReturnValue(translations);

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
            (pickLanguage as Mock).mockReturnValue(lang);
            (translationService.get as Mock).mockReturnValue(translations);

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
