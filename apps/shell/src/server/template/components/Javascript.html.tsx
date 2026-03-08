import { extname, resolve } from 'path';
import { readdirSync } from 'fs';

import { FunctionComponent } from 'react';

import { Config } from '@cohbrgr/shell/env';
import { Logger } from '@cohbrgr/utils';

interface IJavascriptHTMLProps {
    nonce: string;
    isProduction: boolean;
}
export type JavascriptHTMLProps = IJavascriptHTMLProps;

// Placeholder that will be replaced with actual dehydrated state after SSR completes
export const DEHYDRATED_STATE_PLACEHOLDER = '__DEHYDRATED_STATE_PLACEHOLDER__';

const jsDirectoryPath = resolve(process.cwd() + `${Config.staticPath}/client`);
let scriptFiles: string[] = [];
try {
    scriptFiles = readdirSync(jsDirectoryPath).filter(
        (fileName) => extname(fileName) === '.js',
    );
} catch (err) {
    Logger.warn(`HTML-Template: error loading js files for SSR: ${err}`);
}

const Javascript: FunctionComponent<JavascriptHTMLProps> = (
    props: JavascriptHTMLProps,
) => {
    // Build initial state with placeholder for dehydratedState
    // The actual dehydrated state is injected after SSR completes (when Suspense resolves)
    const initialStateTemplate = {
        isProduction: props.isProduction,
        nonce: '',
    };

    // Create JSON with placeholder that will be replaced after render completes
    const jsonWithPlaceholder = JSON.stringify(initialStateTemplate).slice(
        0,
        -1,
    ); // Remove closing brace
    const fullJson = `${jsonWithPlaceholder},"dehydratedState":${DEHYDRATED_STATE_PLACEHOLDER}}`;

    // Escape for safe embedding in JavaScript - handle single quotes, backslashes, and script tags
    const jsonString = fullJson
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/<\/script>/gi, '<\\/script>');

    return (
        <>
            {
                <script
                    id="initial-state"
                    nonce={props.nonce}
                    dangerouslySetInnerHTML={{
                        __html: `__initial_state__ = JSON.parse('${jsonString}')`,
                    }}
                ></script>
            }
            {scriptFiles.map((file) => (
                <script
                    key={file}
                    async
                    type="module"
                    crossOrigin="use-credentials"
                    nonce={props.nonce}
                    src={`/${file}`}
                ></script>
            ))}
        </>
    );
};

Javascript.displayName = 'SSRJavascript';

export default Javascript;
