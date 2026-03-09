import {
    checkContentHealth,
    isContentHealthy,
    startHealthChecks,
} from 'src/server/content-health';

jest.mock('@cohbrgr/utils', () => ({
    Logger: { info: jest.fn() },
}));

const CONTENT_ORIGIN = 'http://localhost:3001';

describe('content-health', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.restoreAllMocks();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('isContentHealthy', () => {
        it('returns false initially', () => {
            expect(isContentHealthy()).toBe(false);
        });
    });

    describe('checkContentHealth', () => {
        it('sets healthy when fetch returns ok', async () => {
            jest.spyOn(global, 'fetch').mockResolvedValue({
                ok: true,
            } as Response);

            const result = await checkContentHealth(CONTENT_ORIGIN);

            expect(result).toBe(true);
            expect(isContentHealthy()).toBe(true);
            expect(fetch).toHaveBeenCalledWith(
                `${CONTENT_ORIGIN}/health`,
                expect.objectContaining({ signal: expect.any(AbortSignal) }),
            );
        });

        it('sets unhealthy when fetch returns not ok', async () => {
            jest.spyOn(global, 'fetch').mockResolvedValue({
                ok: false,
            } as Response);

            const result = await checkContentHealth(CONTENT_ORIGIN);

            expect(result).toBe(false);
            expect(isContentHealthy()).toBe(false);
        });

        it('sets unhealthy when fetch throws', async () => {
            jest.spyOn(global, 'fetch').mockRejectedValue(
                new Error('Connection refused'),
            );

            const result = await checkContentHealth(CONTENT_ORIGIN);

            expect(result).toBe(false);
            expect(isContentHealthy()).toBe(false);
        });

        it('logs when health status changes', async () => {
            const { Logger } = jest.requireMock('@cohbrgr/utils');

            jest.spyOn(global, 'fetch').mockResolvedValue({
                ok: true,
            } as Response);
            await checkContentHealth(CONTENT_ORIGIN);

            expect(Logger.info).toHaveBeenCalledWith('Content health: healthy');

            jest.spyOn(global, 'fetch').mockResolvedValue({
                ok: false,
            } as Response);
            await checkContentHealth(CONTENT_ORIGIN);

            expect(Logger.info).toHaveBeenCalledWith(
                'Content health: unhealthy',
            );
        });

        it('does not log when health status stays the same', async () => {
            const { Logger } = jest.requireMock('@cohbrgr/utils');

            jest.spyOn(global, 'fetch').mockRejectedValue(new Error('fail'));
            await checkContentHealth(CONTENT_ORIGIN);

            // Was already unhealthy, stays unhealthy — no log
            Logger.info.mockClear();
            await checkContentHealth(CONTENT_ORIGIN);
            expect(Logger.info).not.toHaveBeenCalled();
        });
    });

    describe('startHealthChecks', () => {
        it('stops when initially healthy', async () => {
            jest.spyOn(global, 'fetch').mockResolvedValue({
                ok: true,
            } as Response);

            await startHealthChecks(CONTENT_ORIGIN);

            expect(isContentHealthy()).toBe(true);
            expect(jest.getTimerCount()).toBe(0);
        });

        it('retries when initially unhealthy and stops once healthy', async () => {
            jest.spyOn(global, 'fetch')
                .mockRejectedValueOnce(new Error('fail'))
                .mockResolvedValue({ ok: true } as Response);

            await startHealthChecks(CONTENT_ORIGIN);

            expect(isContentHealthy()).toBe(false);
            expect(jest.getTimerCount()).toBe(1);

            // Advance past retry interval
            await jest.advanceTimersByTimeAsync(2_000);

            expect(isContentHealthy()).toBe(true);
            expect(jest.getTimerCount()).toBe(0);
        });
    });
});
