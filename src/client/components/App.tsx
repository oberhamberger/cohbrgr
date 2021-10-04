import React, { FunctionComponent } from 'react';
import { Switch, Route } from 'react-router-dom';

import Content from 'src/client/components/content';
import NotFound from 'src/client/components/not-found';

import 'src/client/resources/styles/Global.scss';

const App: FunctionComponent = () => {
    return (
        <Switch>
            <Route exact path="/">
                <Content />
            </Route>
            <Route path="*">
                <NotFound />
            </Route>
        </Switch>
    );
};

export default App;
