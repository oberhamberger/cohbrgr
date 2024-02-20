import { FunctionComponent } from 'react';
import { readdirSync } from 'fs';
import { resolve, extname } from 'path';
import { Logger } from '@cohbrgr/utils';

interface IJavascriptHTMLProps {
    nonce: string;
    isProduction: boolean;
}
export type JavascriptHTMLProps = IJavascriptHTMLProps;

let scriptFiles: string[] = [];
try {
    scriptFiles = readdirSync(resolve(__dirname + '/../client/js')).filter(
        (fileName) => extname(fileName) === '.js',
    );
} catch (err) {
    Logger.warn(`HTML-Template: error loading js files for SSR: ${err}`);
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
                    src={`/js/${file}`}
                ></script>
            ))}
        </>
    );
};

Javascript.displayName = 'SSRJavascript';

export default Javascript;
