import app from './server';

describe('content server', () => {
    it('should export an express application', () => {
        expect(app).toBeDefined();
        expect(typeof app.use).toBe('function');
        expect(typeof app.listen).toBe('function');
    });
});
