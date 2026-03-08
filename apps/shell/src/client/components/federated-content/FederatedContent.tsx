import { lazy, Suspense, useEffect, useState } from 'react';
import type { FunctionComponent } from 'react';

import { ErrorBoundary, Spinner } from '@cohbrgr/components';

const Content = lazy(() => import('content/Content'));

/**
 * Wraps the federated Content component with a health check.
 * Verifies the content app is available before attempting to load the remote module.
 */
const FederatedContent: FunctionComponent = () => {
    const [status, setStatus] = useState<'checking' | 'healthy' | 'unhealthy'>(
        'checking',
    );

    useEffect(() => {
        const controller = new AbortController();
        fetch('/content-health', { signal: controller.signal })
            .then((res) => {
                setStatus(res.ok ? 'healthy' : 'unhealthy');
            })
            .catch(() => {
                setStatus('unhealthy');
            });
        return () => controller.abort();
    }, []);

    if (status === 'checking') {
        return <Spinner />;
    }

    if (status === 'unhealthy') {
        return null;
    }

    return (
        <ErrorBoundary>
            <Suspense fallback={<Spinner />}>
                <Content />
            </Suspense>
        </ErrorBoundary>
    );
};

FederatedContent.displayName = 'FederatedContent';

export default FederatedContent;
