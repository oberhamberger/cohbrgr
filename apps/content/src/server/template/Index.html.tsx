import { FunctionComponent } from 'react';
import { StaticRouter } from 'react-router-dom/server';

import App from 'src/client/App';
import Javascript from 'src/server/template/components/Javascript.html';
import Stylesheets from 'src/server/template/components/Stylesheets.html';


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
                    content="My name is Christian. I am a Frontend Developer at Netconomy. I mainly work with React and Node.js on online commerce platforms. *sipping coffee*"
                />
                <meta
                    name="theme-color"
                    media="(prefers-color-scheme: light)"
                    content="#fff"
                />
                <meta
                    name="theme-color"
                    media="(prefers-color-scheme: dark)"
                    content="#000"
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
            </head>
            <body>
                <div id="content">
                    <App />
                </div>

                {props.useCSR && (
                    <Javascript
                        nonce={props.nonce}
                        isProduction={props.isProduction}
                    />
                )}
            </body>
        </html>
    );
};

Index.displayName = 'SSRIndex';

export default Index;
