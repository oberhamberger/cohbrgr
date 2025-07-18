import { Logger, findProcessArgs } from '@cohbrgr/utils';
import { NextFunction, Request, Response } from 'express';
import { access, constants, readFileSync } from 'fs';
import { resolve } from 'path';
import routes from 'src/client/routes';

const isGenerator = findProcessArgs(['--generator']);
const routeKeys = Object.keys(routes);
const routeValues = Object.values(routes);
const noncePlaceHolder = /!CSPNONCE_PLACEHOLDER!/g;

const matchPathWithRoutes = (path: string) => {
    let matchedRoute = null;
    routeKeys.forEach((route, index) => {
        if (routeValues[index] === path) {
            matchedRoute = route;
        }
    });
    return matchedRoute;
};

const checkFileExists = (filePath: string) => {
    return new Promise((resolve) => {
        access(filePath, constants.F_OK, (err) => {
            if (err) {
                // The file does not exist or there was an error accessing it
                resolve(false);
            } else {
                // The file exists
                resolve(true);
            }
        });
    });
};

const jam =
    (isProduction: boolean) =>
    async (req: Request, res: Response, next: NextFunction) => {
        if (isProduction && !isGenerator) {
            const matchedRequestRoute = matchPathWithRoutes(req.path);
            const matchedHTMLFileName = resolve(
                __dirname + `/../client/static/${matchedRequestRoute}.html`,
            );
            const fileExists = await Promise.resolve(
                checkFileExists(matchedHTMLFileName),
            );
            if (fileExists) {
                Logger.info(
                    `Found generated file for ${req.path} on route ${matchedRequestRoute}`,
                );
                const matchedHTMLFile = readFileSync(
                    matchedHTMLFileName,
                    'utf8',
                );
                const matchedHTMLFileWithNonce = matchedHTMLFile.replace(
                    noncePlaceHolder,
                    res.locals['cspNonce'],
                );
                res.statusCode = 200;
                return res.send(matchedHTMLFileWithNonce);
            }
        }
        return next();
    };

export default jam;
