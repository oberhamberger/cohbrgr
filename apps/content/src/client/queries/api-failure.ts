/**
 * Reports that the API could not be reached, for any reason: a network error, a
 * timeout, a 429 from the rate limiter, a 5xx, or a status we simply cannot use.
 *
 * The queries degrade rather than throw, because an SSR throw becomes a 500 for
 * the whole page. That trade makes an outage invisible to everyone except the
 * person looking at a nav that is quietly missing, so every degradation has to
 * announce itself here instead.
 *
 * The prefix is stable and greppable on purpose — a log-based alert matches on
 * it alone.
 */
export const API_FAILURE_PREFIX = '[api-unavailable]';

interface IApiFailure {
    /** Path that was requested, e.g. `/navigation/hero`. */
    endpoint: string;
    /** Whatever was thrown. Carries the HTTP status in its message when there was one. */
    error: unknown;
    /** What the caller is rendering instead, so the log says what the visitor saw. */
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

    // Server: emit the shape Cloud Logging parses, so this lands as ERROR
    // severity rather than as an untyped line at default severity.
    if (typeof window === 'undefined') {
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
