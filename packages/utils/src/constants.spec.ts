import { isDevelopment, isProduction } from './constants';

describe('constants', () => {
    describe('isProduction and isDevelopment', () => {
        it('isProduction is a boolean', () => {
            expect(typeof isProduction).toBe('boolean');
        });

        it('isDevelopment is a boolean', () => {
            expect(typeof isDevelopment).toBe('boolean');
        });

        it('isProduction and isDevelopment are mutually exclusive', () => {
            expect(isProduction).not.toBe(isDevelopment);
        });

        it('isDevelopment is the opposite of isProduction', () => {
            expect(isDevelopment).toBe(!isProduction);
        });
    });
});
