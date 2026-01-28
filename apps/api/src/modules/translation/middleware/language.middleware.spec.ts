import type { NextFunction, Request, Response } from 'express';

import {
    defaultLanguage,
    getExplicitLanguageFromRequest,
    getLanguageFromAcceptLanguageHeader,
    pickLanguage,
    requireSupportedLanguage,
    supportedLanguages,
    translations,
} from './language.middleware';

describe('language.middleware', () => {
    describe('exports', () => {
        it('should export translations object', () => {
            expect(translations).toBeDefined();
            expect(typeof translations).toBe('object');
        });

        it('should export supportedLanguages array', () => {
            expect(Array.isArray(supportedLanguages)).toBe(true);
            expect(supportedLanguages).toContain('en');
            expect(supportedLanguages).toContain('de');
        });

        it('should export defaultLanguage as "en"', () => {
            expect(defaultLanguage).toBe('en');
        });
    });

    describe('getExplicitLanguageFromRequest', () => {
        it('should return language from query parameter', () => {
            const request = {
                query: { lang: 'de' },
                params: {},
            } as unknown as Request;

            expect(getExplicitLanguageFromRequest(request)).toBe('de');
        });

        it('should return language from query parameter in lowercase', () => {
            const request = {
                query: { lang: 'DE' },
                params: {},
            } as unknown as Request;

            expect(getExplicitLanguageFromRequest(request)).toBe('de');
        });

        it('should return language from params when query is empty', () => {
            const request = {
                query: {},
                params: { lang: 'en' },
            } as unknown as Request;

            expect(getExplicitLanguageFromRequest(request)).toBe('en');
        });

        it('should return language from params in lowercase', () => {
            const request = {
                query: {},
                params: { lang: 'EN' },
            } as unknown as Request;

            expect(getExplicitLanguageFromRequest(request)).toBe('en');
        });

        it('should prefer query over params', () => {
            const request = {
                query: { lang: 'de' },
                params: { lang: 'en' },
            } as unknown as Request;

            expect(getExplicitLanguageFromRequest(request)).toBe('de');
        });

        it('should return undefined when no language specified', () => {
            const request = {
                query: {},
                params: {},
            } as unknown as Request;

            expect(getExplicitLanguageFromRequest(request)).toBeUndefined();
        });

        it('should return undefined when query is undefined', () => {
            const request = {
                query: undefined,
                params: {},
            } as unknown as Request;

            expect(getExplicitLanguageFromRequest(request)).toBeUndefined();
        });

        it('should handle array query parameter via coerceToString', () => {
            const request = {
                query: { lang: ['de', 'en'] },
                params: {},
            } as unknown as Request;

            expect(getExplicitLanguageFromRequest(request)).toBe('de');
        });
    });

    describe('getLanguageFromAcceptLanguageHeader', () => {
        it('should return first supported language from Accept-Language header', () => {
            const request = {
                headers: { 'accept-language': 'de-DE,de;q=0.9,en;q=0.8' },
            } as unknown as Request;

            expect(getLanguageFromAcceptLanguageHeader(request)).toBe('de');
        });

        it('should return en when Accept-Language is en-US', () => {
            const request = {
                headers: { 'accept-language': 'en-US,en;q=0.9' },
            } as unknown as Request;

            expect(getLanguageFromAcceptLanguageHeader(request)).toBe('en');
        });

        it('should return undefined when header is not a string', () => {
            const request = {
                headers: { 'accept-language': undefined },
            } as unknown as Request;

            expect(getLanguageFromAcceptLanguageHeader(request)).toBeUndefined();
        });

        it('should return undefined when no supported language in header', () => {
            const request = {
                headers: { 'accept-language': 'fr-FR,fr;q=0.9,es;q=0.8' },
            } as unknown as Request;

            expect(getLanguageFromAcceptLanguageHeader(request)).toBeUndefined();
        });

        it('should handle empty segments in header', () => {
            const request = {
                headers: { 'accept-language': ',en,,' },
            } as unknown as Request;

            expect(getLanguageFromAcceptLanguageHeader(request)).toBe('en');
        });

        it('should handle header with quality values', () => {
            const request = {
                headers: { 'accept-language': 'fr;q=0.9,de;q=0.8,en;q=0.7' },
            } as unknown as Request;

            expect(getLanguageFromAcceptLanguageHeader(request)).toBe('de');
        });
    });

    describe('pickLanguage', () => {
        it('should return explicit language from query when supported', () => {
            const request = {
                query: { lang: 'de' },
                params: {},
                headers: { 'accept-language': 'en-US' },
            } as unknown as Request;

            expect(pickLanguage(request)).toBe('de');
        });

        it('should return language from Accept-Language when no explicit language', () => {
            const request = {
                query: {},
                params: {},
                headers: { 'accept-language': 'de-DE,de;q=0.9' },
            } as unknown as Request;

            expect(pickLanguage(request)).toBe('de');
        });

        it('should return default language when explicit language is not supported', () => {
            const request = {
                query: { lang: 'fr' },
                params: {},
                headers: {},
            } as unknown as Request;

            expect(pickLanguage(request)).toBe(defaultLanguage);
        });

        it('should return default language when no language specified anywhere', () => {
            const request = {
                query: {},
                params: {},
                headers: {},
            } as unknown as Request;

            expect(pickLanguage(request)).toBe(defaultLanguage);
        });

        it('should return default language when Accept-Language has no supported languages', () => {
            const request = {
                query: {},
                params: {},
                headers: { 'accept-language': 'fr-FR,es-ES' },
            } as unknown as Request;

            expect(pickLanguage(request)).toBe(defaultLanguage);
        });
    });

    describe('requireSupportedLanguage', () => {
        let mockResponse: Partial<Response>;
        let mockNext: NextFunction;

        beforeEach(() => {
            mockResponse = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn().mockReturnThis(),
            };
            mockNext = jest.fn();
        });

        it('should call next() when no explicit language is provided', () => {
            const request = {
                query: {},
                params: {},
            } as unknown as Request;

            requireSupportedLanguage(
                request,
                mockResponse as Response,
                mockNext,
            );

            expect(mockNext).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it('should call next() when explicit language is supported', () => {
            const request = {
                query: { lang: 'de' },
                params: {},
            } as unknown as Request;

            requireSupportedLanguage(
                request,
                mockResponse as Response,
                mockNext,
            );

            expect(mockNext).toHaveBeenCalled();
            expect(mockResponse.status).not.toHaveBeenCalled();
        });

        it('should return 400 when explicit language is not supported', () => {
            const request = {
                query: { lang: 'fr' },
                params: {},
            } as unknown as Request;

            requireSupportedLanguage(
                request,
                mockResponse as Response,
                mockNext,
            );

            expect(mockNext).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: expect.stringContaining('Unsupported language "fr"'),
            });
        });

        it('should include supported languages in error message', () => {
            const request = {
                query: { lang: 'xyz' },
                params: {},
            } as unknown as Request;

            requireSupportedLanguage(
                request,
                mockResponse as Response,
                mockNext,
            );

            expect(mockResponse.json).toHaveBeenCalledWith({
                error: expect.stringContaining(supportedLanguages.join(', ')),
            });
        });
    });
});
