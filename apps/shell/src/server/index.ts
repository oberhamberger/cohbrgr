import app from 'src/server/server';

import { gracefulStartAndClose } from '@cohbrgr/server';
import { Config } from '@cohbrgr/shell/env';

import type { RenderThunk } from './server-entry';

/**
 * Parses and validates a port number from a string value.
 * @param value - The string value to parse
 * @param fallback - The fallback port number if value is undefined
 * @returns A valid port number
 * @throws Error if the value is not a valid port number (0-65535)
 */
const parsePort = (value: string | undefined, fallback: number): number => {
    if (!value) return fallback;
    const parsed = Number(value);
    if (isNaN(parsed) || parsed < 0 || parsed > 65535) {
        throw new Error(
            `Invalid PORT: ${value}. Must be a number between 0 and 65535`,
        );
    }
    return parsed;
};

const port = parsePort(process.env['PORT'], Config.port);

/**
 * Dynamically imports and initializes the render middleware for server-side rendering.
 * Type assertion needed: nodenext CJS/ESM interop types the default export as the module namespace.
 */
const main = async () => {
    const mod = await import('./server-entry.ts');
    const createRenderThunk = mod.default as unknown as RenderThunk;
    const renderThunk = createRenderThunk();

    app.use(renderThunk);

    gracefulStartAndClose(app, port);
};

main();
