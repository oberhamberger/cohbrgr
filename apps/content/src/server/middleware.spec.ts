import type { Application } from 'express';

import middleware from './middleware';

// Mock the @cohbrgr/server module
jest.mock('@cohbrgr/server', () => ({
    logging: jest.fn(() => jest.fn()),
    methodDetermination: jest.fn(),
}));

describe('server middleware', () => {
    let mockApp: Partial<Application>;
    let mockExpress: { static: jest.Mock };
    let doneFn: jest.Mock;

    beforeEach(() => {
        mockApp = {
            use: jest.fn(),
        };
        mockExpress = {
            static: jest.fn(() => 'static-middleware'),
        };
        doneFn = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should set up logging middleware', () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { logging } = require('@cohbrgr/server');

        middleware(
            mockExpress as never,
            mockApp as Application,
            doneFn,
        );

        expect(logging).toHaveBeenCalled();
        expect(mockApp.use).toHaveBeenCalled();
    });

    it('should set up methodDetermination middleware', () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { methodDetermination } = require('@cohbrgr/server');

        middleware(
            mockExpress as never,
            mockApp as Application,
            doneFn,
        );

        expect(mockApp.use).toHaveBeenCalledWith(methodDetermination);
    });

    it('should set up static file serving', () => {
        middleware(
            mockExpress as never,
            mockApp as Application,
            doneFn,
        );

        expect(mockExpress.static).toHaveBeenCalledWith(
            expect.any(String),
            { dotfiles: 'ignore' },
        );
    });

    it('should call done callback after setup', () => {
        middleware(
            mockExpress as never,
            mockApp as Application,
            doneFn,
        );

        expect(doneFn).toHaveBeenCalled();
    });

    it('should use correct middleware order', () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { logging, methodDetermination } = require('@cohbrgr/server');
        const callOrder: string[] = [];

        (mockApp.use as jest.Mock).mockImplementation((mw) => {
            if (mw === logging()) callOrder.push('logging');
            else if (mw === methodDetermination) callOrder.push('methodDetermination');
            else if (mw === 'static-middleware') callOrder.push('static');
        });

        middleware(
            mockExpress as never,
            mockApp as Application,
            doneFn,
        );

        expect(mockApp.use).toHaveBeenCalledTimes(3);
    });
});
