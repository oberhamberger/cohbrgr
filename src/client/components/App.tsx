import React, { FunctionComponent } from 'react';
import { Routes, Route } from 'react-router-dom';

import 'src/client/resources/styles/index.scss';
import Content from 'src/client/components/content';
import Offline from 'src/client/components/offline';
import NotFound from 'src/client/components/not-found';

const App: FunctionComponent = () => {
    return (
        <Routes>
            <Route path="/" element={<Content />} />
            <Route path="/offline" element={<Offline />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default App;
