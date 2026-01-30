import { StrictMode } from 'react';

import { hydrateRoot } from 'react-dom/client';
import App from 'src/client/App';

const root = document.getElementById('content');

if (root) {
    hydrateRoot(
        root,
        <StrictMode>
            <App />
        </StrictMode>,
    );
}
