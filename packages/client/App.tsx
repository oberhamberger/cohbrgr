import { FunctionComponent } from 'react';
import { Routes, Route } from 'react-router-dom';

import 'packages/client/styles/index.scss';
import Layout from 'packages/client/components/layout';
import Content from 'packages/client/pages/content';
import Offline from 'packages/client/pages/offline';
import NotFound from 'packages/client/pages/not-found';
import routes from 'packages/client/routes';

const App: FunctionComponent = () => {
    return (
        <Layout>
            <Routes>
                <Route path={routes.start} element={<Content />} />
                <Route path={routes.offline} element={<Offline />} />
                <Route path={routes.notFound} element={<NotFound />} />
            </Routes>
        </Layout>
    );
};

App.displayName = 'App';

export default App;
