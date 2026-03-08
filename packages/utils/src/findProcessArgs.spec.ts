import { findProcessArgs } from './findProcessArgs';

describe('findProcessArgs', () => {
    const originalArgv = process.argv;

    beforeEach(() => {
        process.argv = ['node', 'script.js'];
    });

    afterEach(() => {
        process.argv = originalArgv;
    });

    it('returns false when argument is not present', () => {
        expect(findProcessArgs('--watch')).toBe(false);
    });

    it('returns true when single argument is present', () => {
        process.argv = ['node', 'script.js', '--watch'];
        expect(findProcessArgs('--watch')).toBe(true);
    });

    it('returns true when argument is found in array of options', () => {
        process.argv = ['node', 'script.js', '-w'];
        expect(findProcessArgs(['--watch', '-w'])).toBe(true);
    });

    it('returns false when none of the array options are present', () => {
        process.argv = ['node', 'script.js', '--other'];
        expect(findProcessArgs(['--watch', '-w'])).toBe(false);
    });

    it('handles empty argv gracefully', () => {
        process.argv = [];
        expect(findProcessArgs('--test')).toBe(false);
    });

    it('returns true for exact match in array', () => {
        process.argv = ['node', 'script.js', '--verbose'];
        expect(findProcessArgs(['--verbose', '-v'])).toBe(true);
    });
});
