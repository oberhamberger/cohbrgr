import {
    FunctionComponent,
    useEffect,
} from 'react';
import { Routes, Route } from 'react-router-dom';
//import type { IContent } from '@cohbrgr/content/src/client/components/content/Content';
import { onLCP, onINP, onCLS } from 'web-vitals/attribution';

import 'src/client/styles/index.scss';

import Layout from 'src/client/components/layout';
import Offline from 'src/client/pages/offline';
import NotFound from 'src/client/pages/not-found';
import AppRoutes from 'src/client/routes';


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
                        <h1>hi</h1>
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
