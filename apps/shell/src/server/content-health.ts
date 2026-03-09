import { Logger } from '@cohbrgr/utils';

const RETRY_INTERVAL_MS = 2_000;

let contentHealthy = false;

export const isContentHealthy = (): boolean => contentHealthy;

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

    return contentHealthy;
};

export const startHealthChecks = async (
    contentOrigin: string,
): Promise<void> => {
    const healthy = await checkContentHealth(contentOrigin);
    if (healthy) return;

    // Retry until healthy, then stop
    const intervalId = setInterval(async () => {
        const result = await checkContentHealth(contentOrigin);
        if (result) clearInterval(intervalId);
    }, RETRY_INTERVAL_MS);
};
