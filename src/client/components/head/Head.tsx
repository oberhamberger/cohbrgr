import React, { FunctionComponent } from 'react';
import { Helmet } from 'react-helmet';

export enum HeadType {
    server = 'server',
    client = 'client',
}

export type Props = {
    type?: HeadType;
};

const Head: FunctionComponent<Props> = (props: Props) => {
    if (props.type === HeadType.server) {
        return (
            <>
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
                    content="#1c1d1f"
                />
            </>
        );
    }
    return (
        <>
            <Helmet>
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
                    content="#1c1d1f"
                />
            </Helmet>
        </>
    );
};

export default Head;
