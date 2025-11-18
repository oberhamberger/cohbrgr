import { createHash } from 'crypto';

export const etagOf = (payload: unknown): string => {
    const jsonString = JSON.stringify(payload);
    return createHash('sha1').update(jsonString).digest('hex');
};

/** Safely coerce a value (often from ParsedQs) to a string */
export const coerceToString = (value: unknown): string | undefined => {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) {
        const first = value[0];
        return typeof first === 'string' ? first : undefined;
    }
    return undefined;
};
