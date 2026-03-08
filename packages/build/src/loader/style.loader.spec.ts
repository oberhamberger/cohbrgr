import { getStyleLoader } from './style.loader';

describe('getStyleLoader', () => {
    it('returns an array of loaders', () => {
        const loaders = getStyleLoader();
        expect(Array.isArray(loaders)).toBe(true);
    });

    it('returns two loaders', () => {
        const loaders = getStyleLoader();
        expect(loaders).toHaveLength(2);
    });

    it('includes lightningcss-loader as first loader', () => {
        const loaders = getStyleLoader();
        expect(loaders[0]).toEqual({
            loader: 'builtin:lightningcss-loader',
        });
    });

    it('includes sass-loader as second loader', () => {
        const loaders = getStyleLoader();
        const sassLoader = loaders[1] as { loader: string; options: unknown };

        expect(sassLoader.loader).toContain('sass-loader');
        expect(sassLoader.options).toEqual({
            api: 'modern-compiler',
            implementation: expect.stringContaining('sass-embedded'),
        });
    });
});
