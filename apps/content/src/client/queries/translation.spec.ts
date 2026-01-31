import { fetchTranslations, translationQueryOptions } from './translation';

const mockResponse = {
    lang: 'en',
    keys: {
        'hero.title': 'Test Title',
        'hero.subtitle': 'Test Subtitle',
    },
};

describe('translation queries', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('fetchTranslations', () => {
        it('should fetch translations for default language', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const result = await fetchTranslations();

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/translation/en'),
            );
            expect(result).toEqual(mockResponse);
        });

        it('should fetch translations for specified language', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve({ ...mockResponse, lang: 'de' }),
            });

            const result = await fetchTranslations('de');

            expect(global.fetch).toHaveBeenCalledWith(
                expect.stringContaining('/translation/de'),
            );
            expect(result.lang).toBe('de');
        });

        it('should throw error when fetch fails', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                statusText: 'Not Found',
            });

            await expect(fetchTranslations('fr')).rejects.toThrow(
                'Failed to fetch translations: Not Found',
            );
        });
    });

    describe('translationQueryOptions', () => {
        it('should return query options with default language', () => {
            const options = translationQueryOptions();

            expect(options.queryKey).toEqual(['translations', 'en']);
            expect(options.staleTime).toBe(1000 * 60 * 60); // 1 hour
            expect(options.gcTime).toBe(1000 * 60 * 60 * 24); // 24 hours
        });

        it('should return query options with specified language', () => {
            const options = translationQueryOptions('de');

            expect(options.queryKey).toEqual(['translations', 'de']);
        });

        it('should have a queryFn that calls fetchTranslations', async () => {
            (global.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse),
            });

            const options = translationQueryOptions('en');
            const result = await options.queryFn({} as never);

            expect(result).toEqual(mockResponse);
        });
    });
});
