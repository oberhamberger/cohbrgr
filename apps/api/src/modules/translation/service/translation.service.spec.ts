import translationService from './translation.service';

describe('TranslationService', () => {
    describe('translations property', () => {
        it('should have translations loaded', () => {
            expect(translationService.translations).toBeDefined();
            expect(typeof translationService.translations).toBe('object');
        });

        it('should contain en and de translations', () => {
            expect(translationService.translations).toHaveProperty('en');
            expect(translationService.translations).toHaveProperty('de');
        });
    });

    describe('get()', () => {
        it('should return the translations object', () => {
            const result = translationService.get();

            expect(result).toBe(translationService.translations);
        });

        it('should return object with en and de keys', () => {
            const result = translationService.get();

            expect(result).toHaveProperty('en');
            expect(result).toHaveProperty('de');
        });

        it('should return translations with expected keys', () => {
            const result = translationService.get();

            expect(result.en['hero.title']).toBeDefined();
            expect(result.de['hero.title']).toBeDefined();
        });
    });
});
