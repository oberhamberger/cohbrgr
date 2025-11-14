import translationsData from 'data/translations.json';
import { Request } from 'express';
import type { ParsedQs } from 'qs';

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

/** Safely coerce a value (often from ParsedQs) to a string */
function coerceToString(value: unknown): string | undefined {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
        const first = value[0];
        return typeof first === 'string' ? first : undefined;
    }
    return undefined;
}

/** Extract explicit language from query (?lang=) or params (/:lang) using bracket access */
export function getExplicitLanguageFromRequest(
    request: Request,
): string | undefined {
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
}

/** Parse Accept-Language, prefer primary subtags, keep bracket-safe reads everywhere else */
export function getLanguageFromAcceptLanguageHeader(
    request: Request,
): string | undefined {
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
}

export function pickLanguage(request: Request): LanguageCode {
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
}
