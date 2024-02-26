import { FunctionComponent, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import 'src/client/styles/index.scss';

import Layout from 'src/client/components/layout';
import Offline from 'src/client/pages/offline';
import NotFound from 'src/client/pages/not-found';
import routes from 'src/client/routes';
import Spinner from 'src/client/components/spinner';

const Content = lazy(
    () => import('content/Content') as Promise<{ default: FunctionComponent }>,
);

const App: FunctionComponent = () => {
    return (
        <Layout>
            <Routes>
                <Route
                    path={routes.start}
                    element={
                        <Suspense fallback={<Spinner />}>
                            <Content />
                        </Suspense>
                    }
                />
                <Route path={routes.offline} element={<Offline />} />
                <Route path={routes.notFound} element={<NotFound />} />
            </Routes>
        </Layout>
    );
};

App.displayName = 'App';

export default App;
