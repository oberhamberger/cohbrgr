import { createHash } from 'crypto';
import { Application, NextFunction, Request, Response } from 'express';
import type { ParsedQs } from 'qs';

import { logging, methodDetermination } from '@cohbrgr/server';

import navigation from '../data/navigation.json';
import translations from '../data/translations.json';

const isProduction = process.env['NODE_ENV'] === 'production';

type TranslationsMap = typeof translations;
type LanguageCode = keyof TranslationsMap;

const supportedLanguages = Object.keys(translations) as LanguageCode[];
const defaultLanguage: LanguageCode = (
    supportedLanguages.includes('en' as LanguageCode)
        ? 'en'
        : supportedLanguages[0]
) as LanguageCode;

function etagOf(payload: unknown): string {
    const jsonString = JSON.stringify(payload);
    return createHash('sha1').update(jsonString).digest('hex');
}

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
function getExplicitLanguageFromRequest(request: Request): string | undefined {
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
function getLanguageFromAcceptLanguageHeader(
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

function pickLanguage(request: Request): LanguageCode {
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

function requireSupportedLanguage(
    request: Request,
    response: Response,
    next: NextFunction,
) {
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
}

function sendJsonWithEtag(response: Response, payload: unknown) {
    const tag = etagOf(payload);
    response.set('ETag', tag);
    if (response.req.headers['if-none-match'] === tag) {
        return response.status(304).end();
    }
    return response.json(payload);
}

const middleware = (app: Application, done: () => void) => {
    app.use(logging(isProduction));
    app.use(methodDetermination);

    // Full translation bundle
    app.get('/translations', (_request, response) => {
        sendJsonWithEtag(response, translations);
    });

    // Language-specific via path param: /translations/de
    app.get(
        '/translations/:lang',
        requireSupportedLanguage,
        (request, response) => {
            const selectedLanguage = pickLanguage(request);
            const selectedKeys = (translations as TranslationsMap)[
                selectedLanguage
            ];
            sendJsonWithEtag(response, {
                lang: selectedLanguage,
                keys: selectedKeys,
            });
        },
    );

    // Language-specific via query or Accept-Language: /translations/lang?lang=de
    app.get(
        '/translations/lang',
        requireSupportedLanguage,
        (request, response) => {
            const selectedLanguage = pickLanguage(request);
            const selectedKeys = (translations as TranslationsMap)[
                selectedLanguage
            ];
            sendJsonWithEtag(response, {
                lang: selectedLanguage,
                keys: selectedKeys,
            });
        },
    );

    // Navigation (unchanged)
    app.get('/navigation', (_request, response) => {
        sendJsonWithEtag(response, navigation);
    });

    app.use(
        (
            error: any,
            _request: Request,
            response: Response,
            _next: NextFunction,
        ) => {
            const statusCode = Number(error?.status) || 500;
            response
                .status(statusCode)
                .json({ error: error?.message ?? 'Internal Server Error' });
        },
    );

    done();
};

export default middleware;
