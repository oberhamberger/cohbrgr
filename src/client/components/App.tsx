import React, { FunctionComponent } from 'react';
import { Switch, Route } from 'react-router-dom';

import 'src/client/resources/styles/index.scss';
import Content from 'src/client/components/content';
import Offline from 'src/client/components/offline';
import NotFound from 'src/client/components/not-found';

const App: FunctionComponent = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Content />
            </Route>
            <Route exact path="/offline">
                <Offline />
            </Route>
            <Route path="*">
                <NotFound />
            </Route>
        </Switch>
    );
};

export default App;
