import { FunctionComponent } from 'react';
import { readFileSync, readdirSync } from 'fs';
import { resolve, extname } from 'path';
import { Logger } from '@cohbrgr/utils';
import EnvironmentConfig from '@cohbrgr/environments';

interface IStylesheetProps {
    // nonce: string;
    isProduction: boolean;
}
export type StylesheetProps = IStylesheetProps;

let styleFiles: string[] = [];
let styleFileContents = '';
const cssDirectoryPath = resolve(
    process.cwd() + `${EnvironmentConfig.shell.staticPath}/client/css`,
);

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
                        // nonce={props.nonce}
                        rel="stylesheet"
                        href={`/css/${file}`}
                    />
                ))}
            </>
        );
    }

    return (
        <style
            // nonce={props.nonce}
            dangerouslySetInnerHTML={{ __html: styleFileContents }}
        ></style>
    );
};

Stylesheets.displayName = 'SSRStylesheets';

export default Stylesheets;
