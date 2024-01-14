import { FunctionComponent, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

import '@shell/client/styles/index.scss';

import Layout from '@shell/client/components/layout';
import StructuredData from '@shell/client/components/structured-data';
import Navigation from '@shell/client/components/navigation';
import Offline from '@shell/client/pages/offline';
import NotFound from '@shell/client/pages/not-found';
import routes from '@shell/client/routes';

const Content = lazy(() => import('@content/client/index'));

const App: FunctionComponent = () => {
    return (
        <Layout>
            <Routes>
                <Route path={routes.start}>
                    <Suspense fallback={<>...</>}>
                        <Content />
                    </Suspense>
                    <Navigation>
                        <a href="https://mastodon.social/@cohbrgr">Mastodon</a>
                        <a href="https://github.com/oberhamberger">Github</a>
                        <a href="https://www.linkedin.com/in/oberhamberger/">
                            LinkedIn
                        </a>
                    </Navigation>
                </Route>
                <Route path={routes.offline} element={<Offline />} />
                <Route path={routes.notFound} element={<NotFound />} />
            </Routes>
            <StructuredData />
        </Layout>
    );
};

App.displayName = 'App';

export default App;
