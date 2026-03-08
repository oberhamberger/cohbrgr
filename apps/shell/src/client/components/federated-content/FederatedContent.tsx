import { lazy, Suspense, useContext } from 'react';
import type { FunctionComponent } from 'react';

import { ErrorBoundary, Spinner } from '@cohbrgr/components';
import { AppStateContext } from 'src/client/contexts/app-state';

const Content = lazy(() => import('content/Content'));

/**
 * Wraps the federated Content component with server-side health awareness.
 * The health status is determined server-side and passed via initial state.
 */
const FederatedContent: FunctionComponent = () => {
    const { contentHealthy } = useContext(AppStateContext);

    if (!contentHealthy) {
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
