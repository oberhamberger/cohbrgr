import { writeFile, mkdirSync } from 'fs';
import { join } from 'path';
import { fork } from 'child_process';
import { port } from 'src/utils/constants';

enum AppRoutes {
    start = '/',
    offline = '/offline',
    notFound = '*',
}

const serverAddress = `http://localhost:${port}`;
const staticOutputPath = 'dist/client/static';

const staticSiteGenerator = async () => {
    const runningServer = fork('./dist/server/index.js', ['--generator'], {
        silent: true,
    });

    const safeHTMLtoFile = (html: string, index: number) => {
        const outputPath = join(
            staticOutputPath,
            `${Object.keys(AppRoutes)[index]}.html`,
        );
        writeFile(outputPath, html, (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.info(`Data has been saved to the file: ${outputPath}`);
            }
        });
        console.info(`Generated ${Object.values(AppRoutes)[index]}`);
    };

    runningServer.on('exit', (code, signal) => {
        console.info(`Exited Server with code ${code} and signal ${signal}`);
    });

    runningServer.on('message', async (message) => {
        if (message === 'server-ready') {
            const fetchPromises: Promise<Response>[] = [];

            Object.values(AppRoutes).forEach((route) => {
                fetchPromises.push(fetch(new URL(AppRoutes, serverAddress)));
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
                        console.error(
                            `Failed to generate Route with error: ${err}`,
                        );
                        runningServer.kill();
                    });
            });
        }
    });
};

export default staticSiteGenerator;
