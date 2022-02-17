import React, { FunctionComponent } from 'react';
import { Routes, Route } from 'react-router-dom';

import 'src/client/resources/styles/index.scss';
import Layout from 'src/client/components/layout';
import Content from 'src/client/components/pages/content';
import Offline from 'src/client/components/pages/offline';
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
                <Route path={clientRoutes.start} element={<Content />} />
                <Route path={clientRoutes.offline} element={<Offline />} />
                <Route path={clientRoutes.notFound} element={<NotFound />} />
            </Routes>
        </Layout>
    );
};

App.displayName = 'App';

export default App;
