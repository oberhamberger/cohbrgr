import { cloudRunOrigins, ports } from '@cohbrgr/env';

describe('env config', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        vi.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should use local dev config when CLOUD_RUN env is not set', async () => {
        delete process.env['CLOUD_RUN'];
        delete process.env['NODE_ENV'];
        const { Config } = await import('./index');

        expect(Config.port).toBe(ports.shell.dev);
        expect(Config.apiUrl).toBe(`http://localhost:${ports.api.dev}`);
        expect(Config.location).toBe('http://localhost');
        expect(Config.staticPath).toBe('/dist');
    });

    it('should use local production config when NODE_ENV is production', async () => {
        delete process.env['CLOUD_RUN'];
        process.env['NODE_ENV'] = 'production';
        const { Config } = await import('./index');

        expect(Config.port).toBe(ports.shell.prod);
        expect(Config.apiUrl).toBe(`http://localhost:${ports.api.prod}`);
        expect(Config.location).toBe('http://localhost');
        expect(Config.staticPath).toBe('/dist');
    });

    it('should use Cloud Run config when CLOUD_RUN env is set', async () => {
        process.env['CLOUD_RUN'] = 'true';
        const { Config } = await import('./index');

        expect(Config.port).toBe(ports.shell.prod);
        expect(Config.location).toBe(`${cloudRunOrigins.shell}/`);
        expect(Config.staticPath).toBe('/dist');
    });
});
