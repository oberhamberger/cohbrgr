import { coerceToString } from '../coerce';

describe('coerce utilities', () => {
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

        it('should handle empty array', () => {
            expect(coerceToString([])).toBeUndefined();
        });

        it('should handle empty string', () => {
            expect(coerceToString('')).toBe('');
        });
    });
});
