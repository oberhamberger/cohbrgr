import type { IContent } from '@cohbrgr/content/src/client/components/content/Content';
import {
    FunctionComponent,
    lazy,
    Suspense,
    useEffect,
} from 'react';
import { Route, Routes } from 'react-router-dom';
import { onCLS, onINP, onLCP } from 'web-vitals/attribution';

import 'src/client/styles/index.scss';

import { Spinner } from '@cohbrgr/components';
import Layout from 'src/client/components/layout';
import NotFound from 'src/client/pages/not-found';
import Offline from 'src/client/pages/offline';
import AppRoutes from 'src/client/routes';

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
