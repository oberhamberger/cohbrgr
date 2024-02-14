import { FunctionComponent } from 'react';
import { readFileSync, readdirSync } from 'fs';
import { resolve, extname } from 'path';
import Logger from 'src/server/utils/logger';

interface IStylesheetProps {
    nonce: string;
    isProduction: boolean;
}
export type StylesheetProps = IStylesheetProps;

let styleFiles: string[] = [];
let styleFileContents = '';

try {
    styleFiles = readdirSync(resolve(__dirname + '/../shell/css')).filter(
        (fileName) => extname(fileName) === '.css',
    );
    if (styleFiles.length) {
        try {
            styleFiles.forEach((file) => {
                styleFileContents += readFileSync(
                    resolve(__dirname + '/../shell/css/' + file),
                    'utf8',
                );
            });
        } catch (singleFileError) {
            Logger.warn('HTML-Template: error reading css file');
        }
    }
} catch (allFilesError) {
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
                        href={`/css/${file}`}
                    />
                ))}
            </>
        );
    }

    return (
        <style
            nonce={props.nonce}
            dangerouslySetInnerHTML={{ __html: styleFileContents }}
        ></style>
    );
};

Stylesheets.displayName = 'SSRStylesheets';

export default Stylesheets;
