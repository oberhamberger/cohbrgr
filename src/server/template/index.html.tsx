import { readFileSync, readdirSync } from 'fs';
import { resolve, extname } from 'path';
import React, { FunctionComponent } from 'react';
import { StaticRouter } from 'react-router-dom/server';

import Logger from 'src/server/utils/logger';
import App from 'src/client/components/App';

interface IIndexProps {
    location: string;
    useCSR: boolean;
    nonce: string;
}

export type IndexProps = IIndexProps;

let styleFileContents = '';
let scriptFiles: string[] = [];
try {
    styleFileContents = readFileSync(
        resolve(__dirname + '/../client/styles/bundle.css'),
        'utf8',
    );
} catch (err) {
    Logger.warn('HTML-Template: no files found in current context');
}

try {
    scriptFiles = readdirSync(resolve(__dirname + '/../client/scripts')).filter(
        (fileName) => extname(fileName) === '.js',
    );
} catch (err) {
    Logger.warn('HTML-Template: no files found in current context');
}

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
                    content="#1c1d1f"
                />
                <style
                    dangerouslySetInnerHTML={{ __html: styleFileContents }}
                ></style>
                <script
                    crossOrigin="use-credentials"
                    nonce={props.nonce}
                    dangerouslySetInnerHTML={{
                        __html: `
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}`,
                    }}
                ></script>
            </head>
            <body>
                <div id="root">
                    <StaticRouter location={props.location}>
                        <App />
                    </StaticRouter>
                </div>
                {props.useCSR &&
                    scriptFiles.map((file) => (
                        <script
                            key={file}
                            async
                            type="module"
                            crossOrigin="use-credentials"
                            nonce={props.nonce}
                            src={`scripts/${file}`}
                        ></script>
                    ))}
            </body>
        </html>
    );
};

export default Index;
