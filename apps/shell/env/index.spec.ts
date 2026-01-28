describe('env config', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it('should use local config when DOCKER env is not set', () => {
        delete process.env['DOCKER'];
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Config } = require('./index');

        expect(Config.port).toBe(3000);
        expect(Config.location).toBe('http://localhost');
        expect(Config.staticPath).toBe('/dist');
    });

    it('should use docker config when DOCKER env is set', () => {
        process.env['DOCKER'] = 'true';
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Config } = require('./index');

        expect(Config.port).toBe(3000);
        expect(Config.location).toBe('https://cohbrgr-o44imzpega-oa.a.run.app/');
        expect(Config.staticPath).toBe('/dist');
    });
});
