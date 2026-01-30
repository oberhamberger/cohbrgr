import compression from 'compression';
import type { Application } from 'express';
import Express from 'express';
import nocache from 'nocache';

import { healthRoutes } from '../router/health';
import { logging } from '../middleware/logging';
import { methodDetermination } from '../middleware/methodDetermination';
import { applyRateLimit, type RateLimitOptions } from '../middleware/rateLimit';

export interface CreateAppOptions {
    /**
     * Whether the app is running in production mode.
     * Affects logging format and enables rate limiting.
     */
    isProduction: boolean;
    /**
     * Enable rate limiting in production. Defaults to false.
     */
    rateLimit?: boolean | RateLimitOptions;
    /**
     * Enable compression middleware. Defaults to false.
     */
    compression?: boolean;
    /**
     * Enable nocache middleware. Defaults to false.
     */
    nocache?: boolean;
}

/**
 * Creates an Express application with common middleware configured.
 *
 * Applies in order:
 * 1. Rate limiting (production only, if enabled)
 * 2. nocache (if enabled)
 * 3. Request logging
 * 4. Method determination (GET/HEAD only)
 * 5. Compression (if enabled)
 * 6. Health check endpoint at /health
 *
 * @example
 * ```typescript
 * const app = createApp({
 *     isProduction: true,
 *     rateLimit: true,
 *     compression: true,
 *     nocache: true,
 * });
 * ```
 */
export function createApp(options: CreateAppOptions): Application {
    const app: Application = Express();

    // Rate limiting (production only)
    if (options.rateLimit) {
        const rateLimitOptions =
            typeof options.rateLimit === 'object' ? options.rateLimit : {};
        applyRateLimit(app, options.isProduction, rateLimitOptions);
    }

    // Nocache headers
    if (options.nocache) {
        app.use(nocache());
    }

    // Core middleware
    app.use(logging(options.isProduction));
    app.use(methodDetermination);

    // Compression
    if (options.compression) {
        app.use(compression());
    }

    // Health check endpoint
    app.use('/health', healthRoutes);

    return app;
}
