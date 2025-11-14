import { createHash } from 'crypto';
import navigation from 'data/navigation.json';
import translations from 'data/translations.json';
import { Application, NextFunction, Request, Response } from 'express';
import type { LanguageCode, TranslationsMap } from 'src/utils/language';
import {
    getExplicitLanguageFromRequest,
    pickLanguage,
    supportedLanguages,
} from 'src/utils/language';

import { done, logging, methodDetermination } from '@cohbrgr/server';
import { isProduction } from '@cohbrgr/utils';

const defaultPort = isProduction ? 3002 : 3002 + 30;
const port = process.env['PORT'] || defaultPort;

function etagOf(payload: unknown): string {
    const jsonString = JSON.stringify(payload);
    return createHash('sha1').update(jsonString).digest('hex');
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
    return next();
}

function sendJsonWithEtag(response: Response, payload: unknown) {
    const tag = etagOf(payload);
    response.set('ETag', tag);
    if (response.req.headers['if-none-match'] === tag) {
        return response.status(304).end();
    }
    return response.json(payload);
}

const middleware = (app: Application) => {
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

    done(app, Number(port));
};

export default middleware;
