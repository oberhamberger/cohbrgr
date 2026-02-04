import compression from 'compression';
import cors from 'cors';
import Express from 'express';
import helmet from 'helmet';
import nocache from 'nocache';

import { logging } from '../middleware/logging';
import { methodDetermination } from '../middleware/methodDetermination';
import { applyRateLimit, type RateLimitOptions } from '../middleware/rateLimit';
import { healthRoutes } from '../router/health';

import type { Application } from 'express';

export interface CorsOptions {
    /**
     * Allowed origins for CORS requests.
     */
    origins: string[];
}

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
    /**
     * Enable CORS with specified origins. Defaults to disabled.
     */
    cors?: CorsOptions;
    /**
     * Enable helmet security headers. Defaults to true.
     */
    helmet?: boolean;
}

/**
 * Creates an Express application with common middleware configured.
 *
 * Applies in order:
 * 1. Helmet security headers (enabled by default)
 * 2. Rate limiting (production only, if enabled)
 * 3. nocache (if enabled)
 * 4. Request logging
 * 5. Method determination (GET/HEAD only)
 * 6. Compression (if enabled)
 * 7. Health check endpoint at /health
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

    // Security headers (enabled by default)
    if (options.helmet !== false) {
        app.use(helmet());
    }

    // CORS
    if (options.cors) {
        app.use(
            cors({
                origin: options.cors.origins,
                credentials: true,
            }),
        );
    }

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
