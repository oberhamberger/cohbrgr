import routes from '@cohbrgr/shell/src/client/routes';
import { Logger } from '@cohbrgr/utils';
import { fork } from 'child_process';
import { mkdirSync, writeFile } from 'fs';
import { join } from 'path';
import { port } from '../utils/constants';

const serverAddress = `http://localhost:${port}`;
const staticOutputPath = 'dist/client/static';

const staticSiteGenerator = async () => {
    const runningServer = fork('./dist/server/index.js', ['--generator'], {
        silent: true,
    });

    const safeHTMLtoFile = (html: string, index: number) => {
        const outputPath = join(
            staticOutputPath,
            `${Object.keys(routes)[index]}.html`,
        );
        writeFile(outputPath, html, (err) => {
            if (err) {
                Logger.error('Error writing to file:', err);
            } else {
                Logger.info(`Data has been saved to the file: ${outputPath}`);
            }
        });
        Logger.info(`Generated ${Object.values(routes)[index]}`);
    };

    runningServer.on('exit', (code, signal) => {
        Logger.info(`Exited Server with code ${code} and signal ${signal}`);
    });

    runningServer.on('message', async (message) => {
        if (message === 'server-ready') {
            const fetchPromises: Promise<Response>[] = [];

            Object.values(routes).forEach((route) => {
                fetchPromises.push(fetch(new URL(route, serverAddress)));
            });
            Promise.all(fetchPromises).then((responses) => {
                const htmlPromises: Promise<string>[] = [];
                responses.forEach((response) => {
                    htmlPromises.push(response.text());
                });

                Promise.all(htmlPromises)
                    .then(function (htmlArray) {
                        mkdirSync(staticOutputPath);
                        htmlArray.forEach(safeHTMLtoFile);
                        runningServer.kill();
                    })
                    .catch(function (err) {
                        Logger.error(
                            `Failed to generate Route with error: ${err}`,
                        );
                        runningServer.kill();
                    });
            });
        }
    });
};

export default staticSiteGenerator;
