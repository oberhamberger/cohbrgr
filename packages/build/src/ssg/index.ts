import { writeFile, mkdirSync } from 'fs';
import { join } from 'path';
import { fork } from 'child_process';
import routes from '../../../../apps/shell/src/client/routes';
import Logger from 'build/src/utils/logger';
import { port } from 'build/src/utils/constants';

const serverAddress = `http://localhost:${port}`;
const staticOutputPath = 'dist/client/static';

const staticSiteGenerator = async () => {
    const runningServer = fork('./dist/server/index.js', ['--generator'], {
        silent: true,
    });
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
                        htmlArray.forEach((html, index) => {
                            const outputPath = join(
                                staticOutputPath,
                                `${Object.keys(routes)[index]}.html`,
                            );
                            writeFile(outputPath, html, (err) => {
                                if (err) {
                                    Logger.error('Error writing to file:', err);
                                } else {
                                    Logger.info(
                                        `Data has been saved to the file: ${outputPath}`,
                                    );
                                }
                            });
                            Logger.info(
                                `Generated ${Object.values(routes)[index]}`,
                            );
                        });
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
