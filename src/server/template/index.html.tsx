import React, { FunctionComponent } from 'react';
import { StaticRouter } from 'react-router-dom/server';

import App, { clientRoutes } from 'src/client/components/App';
import ServiceWorker from 'src/server/template/components/serviceworker.html';
import Javascript from 'src/server/template/components/javascript.html';
import Stylesheets from 'src/server/template/components/stylesheets.html';

interface IIndexProps {
    isProduction: boolean;
    location: string;
    useCSR: boolean;
    nonce: string;
}

export type IndexProps = IIndexProps;

const Index: FunctionComponent<IIndexProps> = (props: IIndexProps) => {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                <link rel="canonical" href="https://cohbrgr.com/" />

                <title>Christian Oberhamberger</title>

                <meta
                    name="description"
                    content="Christian Oberhamberger - *sipping coffee*"
                />
                <meta
                    name="theme-color"
                    media="(prefers-color-scheme: light)"
                    content="#ffffff"
                />
                <meta
                    name="theme-color"
                    media="(prefers-color-scheme: dark)"
                    content="#001e26"
                />

                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />

                <link rel="manifest" href="/manifest.json" />

                <Stylesheets
                    isProduction={props.isProduction}
                    nonce={props.nonce}
                />
                {props.isProduction && <ServiceWorker nonce={props.nonce} />}
            </head>
            <body>
                <div id="root">
                    <StaticRouter location={props.location}>
                        <App />
                    </StaticRouter>
                </div>

                {props.useCSR && !(props.location === clientRoutes.offline) && (
                    <Javascript nonce={props.nonce} />
                )}
            </body>
        </html>
    );
};

export default Index;
