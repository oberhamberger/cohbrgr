import { extname, resolve } from 'path';
import { readdirSync } from 'fs';

import { FunctionComponent } from 'react';

import { State } from 'src/client/store/state';

import { TranslationCache } from '@cohbrgr/localization';
import { Config } from '@cohbrgr/shell/env';
import { Logger } from '@cohbrgr/utils';

interface IJavascriptHTMLProps {
    nonce: string;
    isProduction: boolean;
    translationCache: TranslationCache;
}
export type JavascriptHTMLProps = IJavascriptHTMLProps;

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
    // Get translations from cache (already resolved after Suspense)
    const translationData = props.translationCache.getResolved();

    const __initial_state__: State = {
        isProduction: props.isProduction,
        nonce: '',
        translations: translationData?.keys ?? {},
    };

    // Escape for safe embedding in JavaScript - handle single quotes, backslashes, and script tags
    const jsonString = JSON.stringify(__initial_state__)
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
