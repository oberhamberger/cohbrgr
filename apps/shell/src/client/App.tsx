import {
    FunctionComponent,
    lazy,
    Suspense
} from 'react';
import { Routes, Route } from 'react-router-dom';
//import { AppStateContext } from 'src/client/contexts/app-state';

import 'src/client/styles/index.scss';

import Layout from 'src/client/components/layout';
import Offline from 'src/client/pages/offline';
import NotFound from 'src/client/pages/not-found';
import AppRoutes from 'src/client/routes';

const Content = lazy(() => import('content/content'));

const App: FunctionComponent = () => {

    // const { nonce } = useContext(AppStateContext);
    return (
        <Layout>
            <Routes>
                <Route
                    path={AppRoutes.start}
                    element={
                        <Suspense>
                            <Content nonce=''/>
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
