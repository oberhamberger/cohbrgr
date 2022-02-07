import React, { FunctionComponent } from 'react';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import Logger from 'src/server/utils/logger';

interface IStylesheetProps {
    nonce: string;
    isProduction: boolean;
}
export type StylesheetProps = IStylesheetProps;

const styleFile = resolve(__dirname + '/../client/css/client.css');
let styleFileContents = '';
try {
    styleFileContents = readFileSync(styleFile, 'utf8');
} catch (err) {
    Logger.warn('HTML-Template: no css files found in current context');
}

const Stylesheets: FunctionComponent<StylesheetProps> = (
    props: StylesheetProps,
) => {
    if (!props.isProduction) {
        return <link rel="stylesheet" href="css/client.css" />;
    }

    return (
        <style
            nonce={props.nonce}
            dangerouslySetInnerHTML={{ __html: styleFileContents }}
        ></style>
    );
};

export default Stylesheets;
