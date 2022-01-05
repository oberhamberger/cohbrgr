import React, { FunctionComponent } from 'react';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import Logger from 'src/server/utils/logger';

let styleFileContents = '';
try {
    styleFileContents = readFileSync(
        resolve(__dirname + '/../client/css/client.css'),
        'utf8',
    );
} catch (err) {
    Logger.warn('HTML-Template: no css files found in current context');
}

const Stylesheets: FunctionComponent = () => {
    return (
        <style dangerouslySetInnerHTML={{ __html: styleFileContents }}></style>
    );
};

export default Stylesheets;
