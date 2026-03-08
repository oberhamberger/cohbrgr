import { useEffect } from 'react';
import type { FunctionComponent } from 'react';
import { Route, Routes } from 'react-router-dom';

import 'src/client/styles/index.scss';

import FederatedContent from 'src/client/components/federated-content/FederatedContent';
import Layout from 'src/client/components/layout';
import NotFound from 'src/client/pages/not-found';
import Offline from 'src/client/pages/offline';
import AppRoutes from 'src/client/routes';
import { onCLS, onINP, onLCP } from 'web-vitals/attribution';

const App: FunctionComponent = () => {
    useEffect(() => {
        onCLS(console.log);
        onINP(console.log);
        onLCP(console.log);
    }, []);

    return (
        <Layout>
            <Routes>
                <Route path={AppRoutes.start} element={<FederatedContent />} />
                <Route path={AppRoutes.offline} element={<Offline />} />
                <Route path={AppRoutes.notFound} element={<NotFound />} />
            </Routes>
        </Layout>
    );
};

App.displayName = 'App';

export default App;
