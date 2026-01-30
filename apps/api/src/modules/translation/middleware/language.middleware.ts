import translationsData from 'data/translations.json';
import { NextFunction, Request, Response } from 'express';
import type { ParsedQs } from 'qs';

import { coerceToString } from '@cohbrgr/server';

export type TranslationsMap = typeof translationsData;
export type LanguageCode = keyof TranslationsMap;

export const translations = translationsData;
export const supportedLanguages = Object.keys(
    translationsData,
) as LanguageCode[];
export const defaultLanguage: LanguageCode = (
    supportedLanguages.includes('en' as LanguageCode)
        ? 'en'
        : supportedLanguages[0]
) as LanguageCode;

/**
 * Extracts the explicitly specified language code from query parameters or URL path parameters.
 */
export const getExplicitLanguageFromRequest = (
    request: Request,
): string | undefined => {
    // query: ParsedQs has an index signature => must use ['lang']
    const queryObject = request.query as ParsedQs | undefined;
    const rawQueryLang = queryObject ? queryObject['lang'] : undefined;
    const queryLanguage = coerceToString(rawQueryLang)?.toLowerCase();
    if (queryLanguage) return queryLanguage;

    // params: Record<string, string> (no index-signature restriction here, but keep consistent)
    const rawParamLang = (request.params as Record<string, string | undefined>)[
        'lang'
    ];
    const paramLanguage = rawParamLang?.toLowerCase();
    if (paramLanguage) return paramLanguage;

    return undefined;
};

/**
 * Parses the Accept-Language header and returns the first supported language code.
 */
export const getLanguageFromAcceptLanguageHeader = (
    request: Request,
): string | undefined => {
    const acceptLanguageHeader = request.headers['accept-language'];
    if (typeof acceptLanguageHeader !== 'string') {
        return undefined;
    }

    // Split header safely into primary tags
    const primaryLanguageTags = acceptLanguageHeader
        .split(',')
        .map((segment) => {
            const trimmed = segment?.trim() ?? '';
            const [languageCode] = trimmed.split(';');
            return (languageCode ?? '').toLowerCase();
        })
        .filter((code) => code.length > 0)
        .map((languageTag) => languageTag.split('-')[0]); // "de-AT" -> "de"

    const firstSupported = primaryLanguageTags.find((primary) =>
        supportedLanguages.includes(primary as LanguageCode),
    );
    return firstSupported;
};

/**
 * Determines the best language code for a request by checking explicit parameters, Accept-Language header, or falling back to the default.
 */
export const pickLanguage = (request: Request): LanguageCode => {
    const explicitLanguage = getExplicitLanguageFromRequest(request);
    if (
        explicitLanguage &&
        supportedLanguages.includes(explicitLanguage as LanguageCode)
    ) {
        return explicitLanguage as LanguageCode;
    }

    const headerLanguage = getLanguageFromAcceptLanguageHeader(request);
    if (
        headerLanguage &&
        supportedLanguages.includes(headerLanguage as LanguageCode)
    ) {
        return headerLanguage as LanguageCode;
    }

    return defaultLanguage;
};

/**
 * Middleware that validates explicit language parameters and returns a 400 error if an unsupported language is requested.
 */
export const requireSupportedLanguage = (
    request: Request,
    response: Response,
    next: NextFunction,
): Response | void => {
    const explicitLanguage = getExplicitLanguageFromRequest(request);

    if (
        explicitLanguage &&
        !supportedLanguages.includes(explicitLanguage as LanguageCode)
    ) {
        return response.status(400).json({
            error: `Unsupported language "${explicitLanguage}". Supported: ${supportedLanguages.join(', ')}.`,
        });
    }
    next();
};
