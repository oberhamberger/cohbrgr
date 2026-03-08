import { cloudRunOrigins, ports } from '@cohbrgr/env';

describe('env config', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should use local dev config when DOCKER env is not set', () => {
        delete process.env['DOCKER'];
        delete process.env['NODE_ENV'];
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Config } = require('./index');

        expect(Config.port).toBe(ports.shell.dev);
        expect(Config.apiUrl).toBe(`http://localhost:${ports.api.dev}`);
        expect(Config.location).toBe('http://localhost');
        expect(Config.staticPath).toBe('/dist');
    });

    it('should use local production config when NODE_ENV is production', () => {
        delete process.env['DOCKER'];
        process.env['NODE_ENV'] = 'production';
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Config } = require('./index');

        expect(Config.port).toBe(ports.shell.prod);
        expect(Config.apiUrl).toBe(`http://localhost:${ports.api.prod}`);
        expect(Config.location).toBe('http://localhost');
        expect(Config.staticPath).toBe('/dist');
    });

    it('should use docker config when DOCKER env is set', () => {
        process.env['DOCKER'] = 'true';
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Config } = require('./index');

        expect(Config.port).toBe(ports.shell.prod);
        expect(Config.location).toBe(`${cloudRunOrigins.shell}/`);
        expect(Config.staticPath).toBe('/dist');
    });
});
