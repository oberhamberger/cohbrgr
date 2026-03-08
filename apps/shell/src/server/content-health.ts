import { Logger } from '@cohbrgr/utils';

const RAPID_INTERVAL_MS = 2_000;
const MAINTENANCE_INTERVAL_MS = 30_000;

let contentHealthy = false;
let intervalId: ReturnType<typeof setInterval> | null = null;

export const isContentHealthy = (): boolean => contentHealthy;

const scheduleChecks = (contentOrigin: string, intervalMs: number) => {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(
        () => checkContentHealth(contentOrigin),
        intervalMs,
    );
};

export const checkContentHealth = async (
    contentOrigin: string,
): Promise<boolean> => {
    const wasHealthy = contentHealthy;

    try {
        const response = await fetch(`${contentOrigin}/health`, {
            signal: AbortSignal.timeout(3000),
        });
        contentHealthy = response.ok;
    } catch {
        contentHealthy = false;
    }

    if (contentHealthy !== wasHealthy) {
        Logger.info(
            `Content health: ${contentHealthy ? 'healthy' : 'unhealthy'}`,
        );
    }

    // Rapid poll until healthy, then back off to maintenance interval
    if (contentHealthy && !wasHealthy) {
        scheduleChecks(contentOrigin, MAINTENANCE_INTERVAL_MS);
    } else if (!contentHealthy && wasHealthy) {
        scheduleChecks(contentOrigin, RAPID_INTERVAL_MS);
    }

    return contentHealthy;
};

export const startHealthChecks = async (
    contentOrigin: string,
): Promise<void> => {
    await checkContentHealth(contentOrigin);
    scheduleChecks(
        contentOrigin,
        contentHealthy ? MAINTENANCE_INTERVAL_MS : RAPID_INTERVAL_MS,
    );
};
