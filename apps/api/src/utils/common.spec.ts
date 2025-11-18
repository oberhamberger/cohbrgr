import { coerceToString, etagOf } from './common';

describe('common', () => {
    describe('etagOf', () => {
        it('should return a consistent hash for the same payload', () => {
            const payload = { a: 1, b: 'test' };
            const etag1 = etagOf(payload);
            const etag2 = etagOf(payload);
            expect(etag1).toBe(etag2);
        });

        it('should return a different hash for different payloads', () => {
            const payload1 = { a: 1, b: 'test' };
            const payload2 = { a: 2, b: 'test' };
            const etag1 = etagOf(payload1);
            const etag2 = etagOf(payload2);
            expect(etag1).not.toBe(etag2);
        });
    });

    describe('coerceToString', () => {
        it('should return the string if the value is a string', () => {
            expect(coerceToString('test')).toBe('test');
        });

        it('should return the first element if the value is an array of strings', () => {
            expect(coerceToString(['test1', 'test2'])).toBe('test1');
        });

        it('should return undefined if the value is an array with a non-string first element', () => {
            expect(coerceToString([1, 'test2'])).toBeUndefined();
        });

        it('should return undefined if the value is not a string or an array', () => {
            expect(coerceToString({ a: 1 })).toBeUndefined();
            expect(coerceToString(123)).toBeUndefined();
            expect(coerceToString(null)).toBeUndefined();
            expect(coerceToString(undefined)).toBeUndefined();
        });
    });
});
