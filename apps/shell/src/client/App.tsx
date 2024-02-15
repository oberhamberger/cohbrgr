import { FunctionComponent } from 'react';
import { Routes, Route } from 'react-router-dom';

import 'src/client/styles/index.scss';

import Layout from 'src/client/components/layout';
import StructuredData from 'src/client/components/structured-data';
import Content from 'src/client/pages/content';
import Offline from 'src/client/pages/offline';
import NotFound from 'src/client/pages/not-found';
import routes from 'src/client/routes';

const App: FunctionComponent = () => {
    return (
        <Layout>
            <Routes>
                <Route path={routes.start} element={<Content />} />
                <Route path={routes.offline} element={<Offline />} />
                <Route path={routes.notFound} element={<NotFound />} />
            </Routes>
            <StructuredData />
        </Layout>
    );
};

App.displayName = 'App';

export default App;
