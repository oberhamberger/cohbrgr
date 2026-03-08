/**
 * Safely coerce a value (often from Express ParsedQs) to a string.
 * Handles string, array of strings, or returns undefined.
 */
export const coerceToString = (value: unknown): string | undefined => {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
        const first = value[0];
        return typeof first === 'string' ? first : undefined;
    }
    return undefined;
};
