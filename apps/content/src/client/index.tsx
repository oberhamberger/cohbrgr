import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from 'src/client/App';

const rootNode = document.getElementById('root');

if (rootNode) { 
    const root = createRoot(rootNode);
    root.render(
        <StrictMode>
            <App />
        </StrictMode>
    );
}
