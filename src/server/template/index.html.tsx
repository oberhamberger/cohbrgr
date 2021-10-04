import React, { FunctionComponent } from 'react';
import App from 'src/client/components/App';
import Head from 'src/client/components/head';
import { HeadType } from 'src/client/components/head/Head';

const Index: FunctionComponent = () => {
    return (
        <html lang="en">
            <head>
                <Head type={HeadType.server} />
                <link rel="stylesheet" href="styles.css"></link>
            </head>
            <body>
                <div id="root">
                    <App />
                </div>
                <script
                    async
                    type="module"
                    crossOrigin="use-credentials"
                    nonce="18cafefd-fbaf-4608-afb1-6edf0a4035df"
                    src="bundle.js"
                ></script>
            </body>
        </html>
    );
};

export default Index;
