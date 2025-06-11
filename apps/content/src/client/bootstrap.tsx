import { hydrateRoot } from 'react-dom/client';
import App from 'src/client/App';

import { StrictMode } from 'react';

const root = document.getElementById('content');

if (root) {
    hydrateRoot(
        root,
        <StrictMode>
            <App />
        </StrictMode>,
    );
}
