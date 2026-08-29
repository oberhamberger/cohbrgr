import { FunctionComponent } from 'react';

import ApiNavigation from 'src/client/components/api-navigation';
import * as styles from 'src/client/pages/codex/Codex.module.scss';

/**
 * Explains what this repository is and how it is put together. Rendered by the
 * shell rather than the content remote, so it stays reachable when the remote
 * is unhealthy.
 */
const Codex: FunctionComponent = () => {
    return (
        <>
            <main>
                <article className={styles.codex}>
                    <header>
                        <p role="doc-subtitle">C·V·Q·O</p>
                        <h1>Codex Visioque</h1>
                    </header>

                    <p className={styles.lede}>
                        cohbrgr is a monorepo for finding out how far
                        server-rendered React gets with no framework doing the
                        work. No create-react-app, no Next.js.
                    </p>
                    <p>
                        The page you came from is assembled at request time out
                        of three applications that deploy on their own.
                    </p>
                    <dl>
                        <dt>Shell</dt>
                        <dd>
                            The host. Express renders React to HTML and the
                            browser takes over from there.
                        </dd>
                        <dt>Content</dt>
                        <dd>
                            A remote component the shell pulls in over Module
                            Federation, on the server as much as in the browser.
                        </dd>
                        <dt>API</dt>
                        <dd>
                            Holds the copy and the navigation, so neither is
                            compiled into a page.
                        </dd>
                    </dl>
                    <p>
                        Rspack does the bundling and Nx caches the build graph.
                        Deployment is three containers on Cloud Run, versioned
                        by date. Every one of those choices sits in the
                        repository, not inside a framework.
                    </p>
                </article>
            </main>

            <ApiNavigation nodeId="codex" />
        </>
    );
};

Codex.displayName = 'Codex';

export default Codex;
