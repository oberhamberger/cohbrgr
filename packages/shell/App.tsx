import { FunctionComponent } from 'react';
import { Routes, Route } from 'react-router-dom';

import 'packages/shell/styles/index.scss';
import Layout from 'packages/shell/components/layout';
import Content from 'packages/shell/pages/content';
import Offline from 'packages/shell/pages/offline';
import NotFound from 'packages/shell/pages/not-found';
import routes from 'packages/shell/routes';

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
