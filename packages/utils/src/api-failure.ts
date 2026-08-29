/**
 * Reports that an API could not be reached, for any reason: a network error, a
 * timeout, a 429 from a rate limiter, a 5xx, or a status we cannot use.
 *
 * Callers degrade rather than throw, because an error thrown during SSR becomes
 * a 500 for the whole page. That trade makes an outage invisible to everyone
 * except the visitor looking at a nav that quietly went missing, so every
 * degradation announces itself here instead.
 *
 * Deliberately not re-exported from the package index. The index pulls in the
 * winston logger, which has no business in a client bundle, and this runs in
 * both. Import it as `@cohbrgr/utils/api-failure`.
 */
export const API_FAILURE_PREFIX = '[api-unavailable]';

export interface IApiFailure {
    /** Path that was requested, e.g. `/navigation/hero`. */
    endpoint: string;
    /** Whatever was thrown. Carries the HTTP status in its message when there was one. */
    error: unknown;
    /** What the caller renders instead, so the log says what the visitor saw. */
    degradedTo: string;
}

export const reportApiFailure = ({
    endpoint,
    error,
    degradedTo,
}: IApiFailure): void => {
    const reason =
        error instanceof Error ? error.message : String(error ?? 'unknown');
    const message = `${API_FAILURE_PREFIX} ${endpoint} failed: ${reason} — serving ${degradedTo}`;

    // `'window' in globalThis` rather than `typeof window`, because this
    // package compiles without the DOM lib and must stay importable from both
    // sides. Server side, emit the shape Cloud Logging parses so this files as
    // ERROR severity instead of an untyped line at default severity.
    const isBrowser = 'window' in globalThis;

    if (!isBrowser) {
        process.stderr.write(
            `${JSON.stringify({
                severity: 'ERROR',
                message,
                endpoint,
                reason,
                degradedTo,
                time: new Date().toISOString(),
            })}\n`,
        );
        return;
    }

    console.error(message);
};
