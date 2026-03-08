import {
    Mode,
    regexFiles,
    regexFonts,
    regexGlobalStyle,
    regexModuleStyles,
    regexSource,
    regexStyle,
    regexTypescript,
    serviceWorker,
} from './constants';

describe('constants', () => {
    describe('Mode enum', () => {
        it('has DEVELOPMENT value', () => {
            expect(Mode.DEVELOPMENT).toBe('development');
        });

        it('has PRODUCTION value', () => {
            expect(Mode.PRODUCTION).toBe('production');
        });
    });

    describe('serviceWorker', () => {
        it('equals sw.js', () => {
            expect(serviceWorker).toBe('sw.js');
        });
    });

    describe('regexStyle', () => {
        it('matches .css files', () => {
            expect(regexStyle.test('file.css')).toBe(true);
        });

        it('matches .scss files', () => {
            expect(regexStyle.test('file.scss')).toBe(true);
        });

        it('matches .sass files', () => {
            expect(regexStyle.test('file.sass')).toBe(true);
        });

        it('does not match .ts files', () => {
            expect(regexStyle.test('file.ts')).toBe(false);
        });
    });

    describe('regexGlobalStyle', () => {
        it('matches global.css', () => {
            expect(regexGlobalStyle.test('global.css')).toBe(true);
        });

        it('matches global.scss', () => {
            expect(regexGlobalStyle.test('global.scss')).toBe(true);
        });

        it('does not match regular.scss', () => {
            expect(regexGlobalStyle.test('regular.scss')).toBe(false);
        });
    });

    describe('regexModuleStyles', () => {
        it('matches .module.css', () => {
            expect(regexModuleStyles.test('Button.module.css')).toBe(true);
        });

        it('matches .module.scss', () => {
            expect(regexModuleStyles.test('Button.module.scss')).toBe(true);
        });

        it('does not match regular .scss', () => {
            expect(regexModuleStyles.test('Button.scss')).toBe(false);
        });
    });

    describe('regexTypescript', () => {
        it('matches .ts files', () => {
            expect(regexTypescript.test('file.ts')).toBe(true);
        });

        it('matches .tsx files', () => {
            expect(regexTypescript.test('file.tsx')).toBe(true);
        });

        it('does not match .js files', () => {
            expect(regexTypescript.test('file.js')).toBe(false);
        });
    });

    describe('regexSource', () => {
        it('matches .ts files', () => {
            expect(regexSource.test('file.ts')).toBe(true);
        });

        it('matches .tsx files', () => {
            expect(regexSource.test('file.tsx')).toBe(true);
        });

        it('matches .js files', () => {
            expect(regexSource.test('file.js')).toBe(true);
        });

        it('matches .jsx files', () => {
            expect(regexSource.test('file.jsx')).toBe(true);
        });

        it('does not match .css files', () => {
            expect(regexSource.test('file.css')).toBe(false);
        });
    });

    describe('regexFonts', () => {
        it('matches .woff files', () => {
            expect(regexFonts.test('font.woff')).toBe(true);
        });

        it('matches .woff2 files', () => {
            expect(regexFonts.test('font.woff2')).toBe(true);
        });

        it('matches .ttf files', () => {
            expect(regexFonts.test('font.ttf')).toBe(true);
        });

        it('matches .eot files', () => {
            expect(regexFonts.test('font.eot')).toBe(true);
        });

        it('matches fonts with version query string', () => {
            expect(regexFonts.test('font.woff?v=1.0.0')).toBe(true);
        });

        it('does not match .svg files', () => {
            expect(regexFonts.test('icon.svg')).toBe(false);
        });
    });

    describe('regexFiles', () => {
        it('matches .png files', () => {
            expect(regexFiles.test('image.png')).toBe(true);
        });

        it('matches .jpg files', () => {
            expect(regexFiles.test('image.jpg')).toBe(true);
        });

        it('matches .jpeg files', () => {
            expect(regexFiles.test('image.jpeg')).toBe(true);
        });

        it('matches .ico files', () => {
            expect(regexFiles.test('favicon.ico')).toBe(true);
        });

        it('matches .svg files', () => {
            expect(regexFiles.test('icon.svg')).toBe(true);
        });

        it('does not match .gif files', () => {
            expect(regexFiles.test('animation.gif')).toBe(false);
        });
    });
});
