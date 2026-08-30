export const API_FAILURE_PREFIX = '[api-unavailable]';

export interface IApiFailure {
    /** Path that was requested, e.g. `/navigation/hero`. */
    endpoint: string;
    /** Whatever was thrown. Carries the HTTP status in its message when there was one. */
    error: unknown;
    /** What the caller renders instead. */
    degradedTo: string;
}

/**
 * Announces that an API could not be reached, for any reason. Callers degrade
 * rather than throw, because an error thrown during SSR becomes a 500 for the
 * whole page — which would otherwise make an outage invisible to everyone but
 * the visitor looking at a nav that quietly went missing.
 */
export const reportApiFailure = ({
    endpoint,
    error,
    degradedTo,
}: IApiFailure): void => {
    const reason =
        error instanceof Error ? error.message : String(error ?? 'unknown');
    const message = `${API_FAILURE_PREFIX} ${endpoint} failed: ${reason} — serving ${degradedTo}`;

    // `'window' in globalThis` rather than `typeof window`: this package
    // compiles without the DOM lib.
    if (!('window' in globalThis)) {
        // The shape Cloud Logging parses, so this files as ERROR severity
        // rather than an untyped line at default severity.
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
