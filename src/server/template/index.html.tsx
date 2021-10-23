import { readFileSync, readdirSync } from 'fs';
import { resolve, extname } from 'path';
import React, { FunctionComponent } from 'react';
import App from 'src/client/components/App';
import { StaticContext } from 'react-router';
import { StaticRouter } from 'react-router-dom';

interface IIndexProps {
    location: string;
    context: StaticContext;
    useCSR: boolean;
    nonce: string;
}

export type IndexProps = IIndexProps;

const styleFile = readFileSync(
    resolve(__dirname + '/../client/styles/bundle.css'),
    'utf8',
);

const scriptFiles = readdirSync(
    resolve(__dirname + '/../client/scripts'),
).filter((fileName) => extname(fileName) === '.js');

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
                <style dangerouslySetInnerHTML={{ __html: styleFile }}></style>
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
                    <StaticRouter
                        location={props.location}
                        context={props.context}
                    >
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
