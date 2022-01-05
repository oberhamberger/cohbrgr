import React, { FunctionComponent } from 'react';
import { readdirSync } from 'fs';
import { resolve, extname } from 'path';
import Logger from 'src/server/utils/logger';

interface IJavascriptHTMLProps {
    nonce: string;
}
export type JavascriptHTMLProps = IJavascriptHTMLProps;

let scriptFiles: string[] = [];
try {
    scriptFiles = readdirSync(resolve(__dirname + '/../client/js')).filter(
        (fileName) => extname(fileName) === '.js',
    );
} catch (err) {
    Logger.warn('HTML-Template: no js files found in current context');
}

const Javascript: FunctionComponent<JavascriptHTMLProps> = (
    props: JavascriptHTMLProps,
) => {
    return (
        <>
            {scriptFiles.map((file) => (
                <script
                    key={file}
                    async
                    type="module"
                    crossOrigin="use-credentials"
                    nonce={props.nonce}
                    src={`js/${file}`}
                ></script>
            ))}
        </>
    );
};

export default Javascript;
