import { FunctionComponent, Suspense, lazy, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from 'src/client/components/layout';
import NotFound from 'src/client/pages/not-found';
import Offline from 'src/client/pages/offline';
import AppRoutes from 'src/client/routes';
import 'src/client/styles/index.scss';
import { onCLS, onINP, onLCP } from 'web-vitals/attribution';

import { Spinner } from '@cohbrgr/components';
import type { IContent } from '@cohbrgr/content/src/client/components/content/Content';

const Content = lazy(
    () =>
        import('content/Content') as Promise<{
            default: FunctionComponent<IContent>;
        }>,
);
const App: FunctionComponent = () => {
    useEffect(() => {
        onCLS(console.log);
        onINP(console.log);
        onLCP(console.log);
    }, []);

    return (
        <Layout>
            <Routes>
                <Route
                    path={AppRoutes.start}
                    element={
                        <Suspense fallback={<Spinner />}>
                            <Content />
                        </Suspense>
                    }
                />
                <Route path={AppRoutes.offline} element={<Offline />} />
                <Route path={AppRoutes.notFound} element={<NotFound />} />
            </Routes>
        </Layout>
    );
};

App.displayName = 'App';

export default App;
