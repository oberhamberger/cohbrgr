import React, { FunctionComponent } from 'react';

import Head from 'src/client/components/head';
import Main from 'src/client/components/main';
import Nav from 'src/client/components/nav';

import 'src/client/resources/Global.scss';

const App: FunctionComponent = () => {
    return (
        <>
            <Head />
            <Main />
            <Nav />
        </>
    );
};

export default App;
