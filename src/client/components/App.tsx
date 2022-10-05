import React, { FunctionComponent, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import 'src/client/resources/styles/index.scss';
import Layout from 'src/client/components/layout';
const Content = lazy(() => import('src/client/components/pages/content'));
const Offline = lazy(() => import('src/client/components/pages/offline'));
import NotFound from 'src/client/components/pages/not-found';

export enum clientRoutes {
    start = '/',
    offline = '/offline',
    notFound = '*',
}

const App: FunctionComponent = () => {
    return (
        <Layout>
            <Routes>
                <Route
                    index
                    element={
                        <Suspense fallback={<div>loading...</div>}>
                            <Content />
                        </Suspense>
                    }
                />
                <Route
                    path={clientRoutes.offline}
                    index={false}
                    element={
                        <Suspense fallback={<div>loading...</div>}>
                            <Offline />
                        </Suspense>
                    }
                />
                <Route path={clientRoutes.notFound} element={<NotFound />} />
            </Routes>
        </Layout>
    );
};

App.displayName = 'App';

export default App;
