import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { NextFunction, Request, Response } from 'express';
import routes from 'src/client/routes';

import { findProcessArgs, Logger } from '@cohbrgr/utils';

const isGenerator = findProcessArgs(['--generator']);
const routeKeys = Object.keys(routes);
const routeValues = Object.values(routes);
const noncePlaceHolder = /!CSPNONCE_PLACEHOLDER!/g;

/**
 * Attempts to match a request path against the defined route values and returns the corresponding route key.
 */
const matchPathWithRoutes = (path: string) => {
    let matchedRoute = null;
    routeKeys.forEach((route, index) => {
        if (routeValues[index] === path) {
            matchedRoute = route;
        }
    });
    return matchedRoute;
};

/**
 * Middleware factory that serves pre-generated static HTML files in production, replacing CSP nonce placeholders with actual nonces.
 */
const jam =
    (isProduction: boolean) =>
    async (req: Request, res: Response, next: NextFunction) => {
        if (isProduction && !isGenerator) {
            const matchedRequestRoute = matchPathWithRoutes(req.path);
            const matchedHTMLFileName = resolve(
                __dirname,
                `../client/static/${matchedRequestRoute}.html`,
            );
            try {
                const matchedHTMLFile = await readFile(
                    matchedHTMLFileName,
                    'utf8',
                );
                Logger.info(
                    `Found generated file for ${req.path} on route ${matchedRequestRoute}`,
                );
                const matchedHTMLFileWithNonce = matchedHTMLFile.replace(
                    noncePlaceHolder,
                    res.locals['cspNonce'],
                );
                res.statusCode = 200;
                return res.send(matchedHTMLFileWithNonce);
            } catch {
                // intentionally swallow: missing or unreadable file → next()
            }
        }
        return next();
    };

export default jam;
