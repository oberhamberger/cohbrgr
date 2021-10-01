import React from 'react';
import { hydrate } from 'react-dom';
import App from 'src/client/components/App';
import Index from 'src/server/template/index.html';

hydrate(
    <React.StrictMode>
        <Index>
            <App />
        </Index>
    </React.StrictMode>,
    document.getElementById('root'),
);
