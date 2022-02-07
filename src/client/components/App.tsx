import React, { FunctionComponent } from 'react';
import { Routes, Route } from 'react-router-dom';

import 'src/client/resources/styles/index.scss';
import Content from 'src/client/components/content';
import Offline from 'src/client/components/offline';
import NotFound from 'src/client/components/not-found';

export const clientRoutes = {
    start: '/',
    offline: '/offline',
    notFound: '*',
};

const App: FunctionComponent = () => {
    return (
        <Routes>
            <Route path={clientRoutes.start} element={<Content />} />
            <Route path={clientRoutes.offline} element={<Offline />} />
            <Route path={clientRoutes.notFound} element={<NotFound />} />
        </Routes>
    );
};

export default App;
