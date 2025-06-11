import { readdirSync, readFileSync } from 'fs';
import { extname, resolve } from 'path';
import { Config } from '@cohbrgr/shell/env';
import { Logger } from '@cohbrgr/utils';
import { FunctionComponent } from 'react';

interface IStylesheetProps {
    nonce: string;
    isProduction: boolean;
}
export type StylesheetProps = IStylesheetProps;

let styleFiles: string[] = [];
let styleFileContents = '';
const cssDirectoryPath = resolve(process.cwd() + `${Config.staticPath}/client`);

try {
    styleFiles = readdirSync(cssDirectoryPath).filter(
        (fileName) => extname(fileName) === '.css',
    );
    if (styleFiles.length) {
        try {
            styleFiles.forEach((file) => {
                styleFileContents += readFileSync(
                    resolve(cssDirectoryPath, file),
                    'utf8',
                );
            });
        } catch {
            Logger.warn('HTML-Template: error reading css file');
        }
    }
} catch {
    Logger.warn('HTML-Template: no css files found in current context');
}

const Stylesheets: FunctionComponent<StylesheetProps> = (
    props: StylesheetProps,
) => {
    if (!props.isProduction) {
        return (
            <>
                {styleFiles.map((file) => (
                    <link
                        key={file}
                        nonce={props.nonce}
                        rel="stylesheet"
                        href={`/${file}`}
                    />
                ))}
            </>
        );
    }

    return (
        <>
            <style
                // nonce={props.nonce}
                dangerouslySetInnerHTML={{ __html: styleFileContents }}
            ></style>
            {styleFiles.map((file) => (
                <link
                    key={file}
                    nonce={props.nonce}
                    rel="stylesheet"
                    href=''
                    data-webpack={`:chunk-${file.split('.')[0]}`}
                />
            ))}
        </>
    );
};

Stylesheets.displayName = 'SSRStylesheets';

export default Stylesheets;
