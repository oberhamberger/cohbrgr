import { FunctionComponent } from 'react';
import { readdirSync } from 'fs';
import { resolve, extname } from 'path';
import Logger from '@shell/src/server/utils/logger';
import { State } from '@shell/src/client/store/state';

interface IJavascriptHTMLProps {
    nonce: string;
    isProduction: boolean;
}
export type JavascriptHTMLProps = IJavascriptHTMLProps;

let scriptFiles: string[] = [];
try {
    scriptFiles = readdirSync(resolve(__dirname + '/../shell/js')).filter(
        (fileName) => extname(fileName) === '.js',
    );
} catch (err) {
    Logger.warn(`HTML-Template: error loading js files for SSR: ${err}`);
}

const Javascript: FunctionComponent<JavascriptHTMLProps> = (
    props: JavascriptHTMLProps,
) => {
    const __initial_state__: State = {
        isProduction: props.isProduction,
    };

    return (
        <>
            {
                <script
                    id="initial-state"
                    nonce={props.nonce}
                    dangerouslySetInnerHTML={{
                        __html: `__initial_state__ = JSON.parse('${JSON.stringify(
                            __initial_state__,
                        )}')`,
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
                    src={`/js/${file}`}
                ></script>
            ))}
        </>
    );
};

Javascript.displayName = 'SSRJavascript';

export default Javascript;
